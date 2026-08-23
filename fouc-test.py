from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 800}, color_scheme="dark")
    pg = ctx.new_page()
    pg.add_init_script("try{localStorage.setItem('uc-theme','dark')}catch(e){}")

    # Throttle so any flash would be wide enough to catch.
    cdp = ctx.new_cdp_session(pg)
    cdp.send("Network.enable")
    cdp.send("Network.emulateNetworkConditions", {
        "offline": False, "latency": 400,
        "downloadThroughput": 50 * 1024, "uploadThroughput": 50 * 1024,
    })

    pg.goto("http://localhost:3000/", wait_until="domcontentloaded")
    print("at DOMContentLoaded, html class:",
          pg.evaluate("document.documentElement.className.includes('dark') ? 'dark' : 'light'"))
    print("body background:", pg.evaluate("getComputedStyle(document.body).backgroundColor"))

    pg.wait_for_load_state("networkidle")
    print("after full load:", pg.evaluate("getComputedStyle(document.body).backgroundColor"))
    print("(the product's dark ground #0d1017 is rgb(13, 16, 23))")
    b.close()
