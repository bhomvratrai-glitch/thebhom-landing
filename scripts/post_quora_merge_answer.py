#!/usr/bin/env python3
"""
Quora Answer 2: How do I merge PDF files for free?
"""

import asyncio
import json
import time
import urllib.request
import websockets

ANSWER_HTML = """
<p>Merging multiple PDF files together without paying for an Adobe Acrobat subscription can be done in under 30 seconds. However, <b>be careful which online tool you use</b> — many well-known sites upload your personal files to remote third-party cloud servers and hit you with paywalls after 2 merges.</p>

<p>Here are the 3 best, completely free ways to combine PDF files safely in 2026:</p>

<br>
<p><b>1. Browser-Side WebAssembly (Best for All Devices &amp; 100% Privacy)</b></p>
<p>If you are on Windows, Mac, Linux, or mobile and want an effortless drag-and-drop tool that <b>never uploads your documents to the cloud</b>, use <a href="https://www.thebhom.in/imgpdf/merge-pdf">TheBhom Free PDF Merge &amp; Combine Tool</a>.</p>

<p><b>Why this is the safest online method:</b></p>
<ul>
  <li><b>100% Client-Side Processing:</b> The entire merge operation runs locally in your browser via WebAssembly. Your PDFs remain strictly on your machine and never touch any server.</li>
  <li><b>Visual Page Reordering:</b> You can drag and drop individual pages or entire documents to set the exact page sequence.</li>
  <li><b>No Limits &amp; No Watermarks:</b> Combine 2, 10, or 50+ files at once with zero daily caps or hidden fees.</li>
  <li><b>No Sign-Up Required:</b> Instant download without entering an email address.</li>
</ul>

<br>
<p><b>2. macOS Built-in (Apple Preview — Zero Software Needed)</b></p>
<p>If you are on a Mac, you do not need any website or third-party program:</p>
<ol>
  <li>Open your first PDF in <b>Preview</b>.</li>
  <li>Press <b>Cmd + Option + 2</b> to open the thumbnail sidebar.</li>
  <li>Select the thumbnail where you want to insert additional pages.</li>
  <li>Drag and drop the other PDF file(s) from Finder directly into the thumbnail sidebar.</li>
  <li>Click <i>File &rarr; Export as PDF</i> to save the merged document.</li>
</ol>

<br>
<p><b>3. Open-Source Command Line (For Developers &amp; Power Users)</b></p>
<p>If you work in Linux or macOS terminal, <code>poppler-utils</code> is blazing fast:</p>
<pre>pdfunite file1.pdf file2.pdf file3.pdf merged_output.pdf</pre>

<br>
<p><b>Pro-Tip After Merging:</b> Merged PDFs can frequently swell to 15MB–30MB if they contain high-resolution scans. If you need to send the combined file over email or upload to a job application portal, run the merged file through <a href="https://www.thebhom.in/imgpdf/compress-pdf-online">TheBhom PDF Compressor</a> to cut the file size by 70–85% while keeping the text razor-sharp.</p>
"""

async def post_merge_answer():
    tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json").read())
    q_tabs = [t for t in tabs if "quora.com" in t.get("url", "") and t.get("type") == "page"]
    if not q_tabs:
        print("[!] No Quora tab found.")
        return False
    
    ws_url = q_tabs[0]["webSocketDebuggerUrl"]
    print(f"[*] Connecting to Quora tab: {q_tabs[0]['url']}")
    
    async with websockets.connect(ws_url, max_size=10_000_000) as ws:
        # Step 1: Click the Answer button
        js_click_answer = """(() => {
            const btns = Array.from(document.querySelectorAll("button, [role=button]"));
            const answerBtn = btns.find(b => b.innerText && b.innerText.includes("Answer"));
            if (answerBtn) {
                answerBtn.click();
                return { clicked: true, text: answerBtn.innerText };
            }
            return { clicked: false };
        })()"""
        
        await ws.send(json.dumps({
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {"expression": js_click_answer, "returnByValue": True}
        }))
        res = await ws.recv()
        print("[*] Click Answer:", json.loads(res).get("result", {}).get("result", {}).get("value", {}))
        
        time.sleep(2)
        
        # Step 2: Inject HTML content
        js_inject = f"""(() => {{
            const ed = document.querySelector("[contenteditable=true]");
            if (!ed) return {{ error: "Editor not found" }};
            ed.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("delete", false, null);
            
            const html = {json.dumps(ANSWER_HTML.strip())};
            document.execCommand("insertHTML", false, html);
            
            const links = Array.from(ed.querySelectorAll("a")).map(a => ({{ text: a.innerText, href: a.href }}));
            const postBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.trim() === "Post");
            
            return {{
                success: true,
                length: ed.innerText.length,
                wordCount: ed.innerText.trim().split(/\\s+/).length,
                links: links,
                postBtnFound: !!postBtn,
                postBtnDisabled: postBtn ? postBtn.disabled : null
            }};
        }})()"""
        
        await ws.send(json.dumps({
            "id": 2,
            "method": "Runtime.evaluate",
            "params": {"expression": js_inject, "returnByValue": True}
        }))
        res2 = await ws.recv()
        info = json.loads(res2).get("result", {}).get("result", {}).get("value", {})
        print("[*] Injection status:", json.dumps(info, indent=2))
        
        if not info.get("success"):
            print("[!] Failed to inject.")
            return False
            
        time.sleep(2)
        
        # Step 3: Click Post
        js_post = """(() => {
            const postBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.trim() === "Post");
            if (postBtn) {
                postBtn.click();
                return { clicked: true };
            }
            return { clicked: false, error: "Post button not found" };
        })()"""
        
        await ws.send(json.dumps({
            "id": 3,
            "method": "Runtime.evaluate",
            "params": {"expression": js_post, "returnByValue": True}
        }))
        res3 = await ws.recv()
        print("[*] Post click result:", json.loads(res3).get("result", {}).get("result", {}).get("value", {}))
        
        time.sleep(4)
        
        # Step 4: Dismiss credential modal if present
        js_done = """(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const doneBtn = btns.find(b => b.innerText && b.innerText.trim() === "Done");
            if (doneBtn) {
                doneBtn.click();
                return { dismissed: true };
            }
            return { dismissed: false };
        })()"""
        await ws.send(json.dumps({
            "id": 4,
            "method": "Runtime.evaluate",
            "params": {"expression": js_done, "returnByValue": True}
        }))
        res4 = await ws.recv()
        print("[*] Modal dismiss:", json.loads(res4).get("result", {}).get("result", {}).get("value", {}))
        
        # Step 5: Check current url
        await ws.send(json.dumps({
            "id": 5,
            "method": "Runtime.evaluate",
            "params": {"expression": "window.location.href", "returnByValue": True}
        }))
        res5 = await ws.recv()
        print("[*] Final URL:", json.loads(res5).get("result", {}).get("result", {}).get("value", {}))
        return True

if __name__ == "__main__":
    asyncio.run(post_merge_answer())
