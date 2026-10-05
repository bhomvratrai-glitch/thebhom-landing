#!/usr/bin/env python3
"""
Quora Answer Poster for TheBhom Tools & News
Direct high-authority backlink & organic referral traffic engine.
"""

import asyncio
import json
import time
import urllib.request
import websockets

ANSWER_HTML = """
<p>Compressing a PDF online for free is simple, but there is <b>one major catch most people overlook: privacy and file security.</b></p>

<p>Most traditional online PDF compression tools upload your sensitive documents (tax records, resumes, bank statements, legal contracts) to third-party cloud servers in foreign countries, store them indefinitely, and frequently slap you with daily usage caps or paywalls after 2 files.</p>

<p>Here is the breakdown of how to compress PDFs for free safely, with zero file size limits and zero privacy risks.</p>

<br>
<p><b>Method 1: Browser-Side Compression (100% Free &amp; Completely Private)</b></p>
<p>In modern web development, compression can now run entirely inside your browser using WebAssembly. Your file is processed directly by your computer's CPU and RAM — it <b>never gets uploaded to any server</b>.</p>

<p>A completely free, privacy-first tool built on this architecture is <a href="https://www.thebhom.in/imgpdf/compress-pdf-online">TheBhom Free Online PDF Compressor</a>.</p>

<p><b>Why this approach is the best option:</b></p>
<ul>
  <li><b>Zero Cloud Uploads:</b> 100% client-side WebAssembly processing. Complete confidentiality for sensitive papers.</li>
  <li><b>No Paywalls or Daily Limits:</b> Compress as many multi-megabyte PDFs as you need.</li>
  <li><b>No Watermarks &amp; No Registration:</b> No email signups, no watermarks stamped onto your pages.</li>
  <li><b>Adjustable Presets:</b>
    <ul>
      <li><i>Extreme Compression:</i> Drops 20MB files down to under 200KB–500KB (perfect for government exam portals and job application sites with strict limits).</li>
      <li><i>Recommended Compression:</i> 70–80% size reduction while preserving crisp text and sharp diagrams for email attachments.</li>
      <li><i>Less Compression:</i> High-fidelity compression for printing and client presentations.</li>
    </ul>
  </li>
</ul>

<br>
<p><b>Method 2: Native OS Tools (Offline Alternative)</b></p>
<p>If you prefer an offline method without opening a browser:</p>
<ul>
  <li><b>On macOS (Preview):</b> Double-click to open your PDF in Preview &rarr; Click <i>File</i> &rarr; <i>Export</i> &rarr; In the <i>Quartz Filter</i> dropdown, select <i>Reduce File Size</i>. (Note: Preview's default filter can sometimes make images overly blurry).</li>
  <li><b>On Windows (Virtual Print):</b> Open the document in your browser or viewer &rarr; Press Ctrl+P &rarr; Select <i>Microsoft Print to PDF</i> &rarr; Adjust printer DPI to 150 DPI for a quick size cut.</li>
</ul>

<br>
<p><b>Bonus Tip: How to Hit Strict &lt;200KB Upload Caps</b></p>
<p>If an online government portal or university form requires an exact file size under 100KB–200KB:</p>
<ol>
  <li>Run the document through <a href="https://www.thebhom.in/imgpdf/compress-pdf-online">TheBhom PDF Compressor</a> on <i>Extreme</i> mode.</li>
  <li>If the file is still too large, remove blank or duplicate annexure pages first using <a href="https://www.thebhom.in/imgpdf/merge-pdf">TheBhom PDF Merge &amp; Organize</a> before compressing.</li>
  <li>Convert full-color multi-page scans to 8-bit grayscale — this instantly eliminates 66% of the raw color channel data.</li>
</ol>

<p>Bottom line: Avoid sketchy sites that demand your email or charge a monthly subscription just to shrink a 5MB document. Modern client-side tools make it instant, private, and 100% free.</p>
"""

async def post_answer():
    tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json").read())
    q_tabs = [t for t in tabs if "quora.com" in t.get("url", "") and t.get("type") == "page"]
    if not q_tabs:
        print("[!] No Quora page tab found in Chrome.")
        return False
    
    ws_url = q_tabs[0]["webSocketDebuggerUrl"]
    print(f"[*] Connecting to Quora tab: {q_tabs[0]['url']}")
    
    async with websockets.connect(ws_url, max_size=10_000_000) as ws:
        # Step 1: Ensure editor is focused and clear existing draft
        js_inject = f"""(() => {{
            const ed = document.querySelector("[contenteditable=true]");
            if (!ed) return {{ error: "Editor not found" }};
            ed.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("delete", false, null);
            
            const html = {json.dumps(ANSWER_HTML.strip())};
            document.execCommand("insertHTML", false, html);
            
            // Check links and word count
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
            "id": 1,
            "method": "Runtime.evaluate",
            "params": {"expression": js_inject, "returnByValue": True}
        }))
        res = await ws.recv()
        info = json.loads(res).get("result", {}).get("result", {}).get("value", {})
        print("[*] Injection status:", json.dumps(info, indent=2))
        
        if not info.get("success"):
            print("[!] Failed to inject answer.")
            return False
            
        print("[*] Answer successfully populated into Quora editor.")
        print(f"[*] Total words: {info.get('wordCount')}, Links injected: {len(info.get('links', []))}")
        
        # Step 2: Click the Post button
        time.sleep(2)
        js_click_post = """(() => {
            const postBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.trim() === "Post");
            if (postBtn) {
                postBtn.click();
                return { clicked: true };
            }
            return { clicked: false, error: "Post button not found" };
        })()"""
        
        await ws.send(json.dumps({
            "id": 2,
            "method": "Runtime.evaluate",
            "params": {"expression": js_click_post, "returnByValue": True}
        }))
        res2 = await ws.recv()
        click_info = json.loads(res2).get("result", {}).get("result", {}).get("value", {})
        print("[*] Post button click result:", click_info)
        
        # Step 3: Wait 4 seconds and verify submission
        time.sleep(4)
        js_verify = """(() => {
            const ed = document.querySelector("[contenteditable=true]");
            const postBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.trim() === "Post");
            return {
                editorStillOpen: !!ed,
                postBtnStillVisible: !!postBtn,
                currentUrl: window.location.href
            };
        })()"""
        
        await ws.send(json.dumps({
            "id": 3,
            "method": "Runtime.evaluate",
            "params": {"expression": js_verify, "returnByValue": True}
        }))
        res3 = await ws.recv()
        verify_info = json.loads(res3).get("result", {}).get("result", {}).get("value", {})
        print("[*] Verification after submit:", json.dumps(verify_info, indent=2))
        return True

if __name__ == "__main__":
    asyncio.run(post_answer())
