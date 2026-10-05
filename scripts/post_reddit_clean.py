#!/usr/bin/env python3
"""
Clean Reddit Submitter for r/SideProject
"""

import asyncio
import json
import time
import urllib.request
import websockets

TITLE = "I built a free, client-side PDF & image toolkit (Runs locally with WebAssembly)"

BODY = """Hey r/SideProject,

I got tired of online PDF compressors and converters charging subscriptions or silently uploading personal files (resumes, tax records) to remote cloud servers.

So I built **TheBhom ImgPDF** (https://www.thebhom.in/imgpdf/) — a web tool suite powered by WebAssembly that runs entirely inside your browser.

### Key Features:
- **100% Client-Side Processing:** Files are processed by your computer's CPU and never leave your machine.
- **Zero Paywalls & No Watermarks:** Completely unrestricted usage.
- **Tools included:** Extreme & recommended PDF compression, PDF merge, PDF split, image to PDF conversion, and background removal.

Check it out here: https://www.thebhom.in/imgpdf/

Would love any feedback, bug reports, or feature requests from the community!"""

async def run():
    tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json").read())
    r_tabs = [t for t in tabs if "reddit.com" in t.get("url", "") and t.get("type") == "page"]
    if not r_tabs:
        print("[!] No Reddit tab found")
        return
        
    ws_url = r_tabs[0]["webSocketDebuggerUrl"]
    print(f"[*] Connecting to Reddit tab: {r_tabs[0]['url']}")
    
    async with websockets.connect(ws_url, max_size=10_000_000) as ws:
        # Step 1: Switch to Markdown if button is visible
        js_switch_md = """(() => {
            const btn = Array.from(document.querySelectorAll("button")).find(b => b.innerText && b.innerText.includes("Switch to Markdown"));
            if (btn) {
                btn.click();
                return true;
            }
            return false;
        })()"""
        await ws.send(json.dumps({"id": 1, "method": "Runtime.evaluate", "params": {"expression": js_switch_md, "returnByValue": True}}))
        res1 = await ws.recv()
        print("[*] Switch to Markdown:", json.loads(res1).get("result", {}).get("result", {}).get("value"))
        
        time.sleep(1)
        
        # Step 2: Populate Title and Body
        js_populate = f"""(() => {{
            const titleComp = document.querySelector("post-composer-title");
            const titleTa = titleComp && titleComp.shadowRoot ? titleComp.shadowRoot.querySelector("textarea") : null;
            if (titleTa) {{
                titleTa.value = {json.dumps(TITLE)};
                titleTa.dispatchEvent(new Event("input", {{ bubbles: true }}));
                titleTa.dispatchEvent(new Event("change", {{ bubbles: true }}));
            }}
            
            const comp = document.querySelector("shreddit-composer");
            const md = comp ? comp.markdownComposer : null;
            const bodyTa = md && md.shadowRoot ? md.shadowRoot.querySelector("textarea[part=textarea-input]") : null;
            if (bodyTa) {{
                bodyTa.value = {json.dumps(BODY)};
                bodyTa.dispatchEvent(new Event("input", {{ bubbles: true }}));
                bodyTa.dispatchEvent(new Event("change", {{ bubbles: true }}));
            }}
            
            const submitComp = document.querySelector("r-post-form-submit-button");
            const submitBtn = submitComp && submitComp.shadowRoot ? submitComp.shadowRoot.querySelector("button") : null;
            
            return {{
                titleSet: titleTa ? titleTa.value : null,
                bodyLength: bodyTa ? bodyTa.value.length : 0,
                btnDisabled: submitComp ? submitComp.disabled : null,
                innerBtnDisabled: submitBtn ? submitBtn.disabled : null
            }};
        }})()"""
        
        await ws.send(json.dumps({"id": 2, "method": "Runtime.evaluate", "params": {"expression": js_populate, "returnByValue": True}}))
        res2 = await ws.recv()
        status = json.loads(res2).get("result", {}).get("result", {}).get("value", {})
        print("[*] Form populate status:", json.dumps(status, indent=2))
        
        time.sleep(2)
        
        # Step 3: Click Submit
        js_submit = """(() => {
            const submitComp = document.querySelector("r-post-form-submit-button");
            const submitBtn = submitComp && submitComp.shadowRoot ? submitComp.shadowRoot.querySelector("button") : null;
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
                return { clicked: true };
            }
            return { clicked: false, error: "Submit button disabled or not found" };
        })()"""
        await ws.send(json.dumps({"id": 3, "method": "Runtime.evaluate", "params": {"expression": js_submit, "returnByValue": True}}))
        res3 = await ws.recv()
        print("[*] Submit click:", json.loads(res3).get("result", {}).get("result", {}).get("value"))
        
        time.sleep(5)
        
        # Step 4: Check final URL
        await ws.send(json.dumps({"id": 4, "method": "Runtime.evaluate", "params": {"expression": "window.location.href", "returnByValue": True}}))
        res4 = await ws.recv()
        print("[*] Final URL:", json.loads(res4).get("result", {}).get("result", {}).get("value"))

if __name__ == "__main__":
    asyncio.run(run())
