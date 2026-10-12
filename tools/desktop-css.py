"""產生電腦版（大螢幕）字級放大區塊：掃 CSS 最外層規則的 font-size: Npx，等比放大後附在檔尾。
重跑會先拿掉舊區塊。用法：python3 tools/desktop-css.py shared/app.css shared/story.css"""
import re, sys
START, END = '/* ===== 電腦版放大（tools/desktop-css.py 自動產生，不要手改） ===== */', '/* ===== 電腦版放大 end ===== */'
TIERS = [(1200, 1.14), (1600, 1.24)]

def rules(css):
    out, i, depth, buf_start = [], 0, 0, 0
    sel = ''
    while i < len(css):
        c = css[i]
        if css.startswith('/*', i):
            j = css.find('*/', i); i = j + 2; continue
        if c == '{':
            if depth == 0: sel = css[buf_start:i].strip(); body_start = i + 1
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                if not sel.startswith('@'): out.append((sel, css[body_start:i]))
                buf_start = i + 1
        i += 1
    return out

for path in sys.argv[1:]:
    css = open(path, encoding='utf-8').read()
    if START in css: css = css[:css.index(START)].rstrip() + '\n'
    found = []
    for sel, body in rules(css):
        m = re.findall(r'font-size:\s*([\d.]+)px', body)
        if m and float(m[-1]) < 30: found.append((sel, float(m[-1])))
    block = [START]
    for bp, k in TIERS:
        block.append('@media (min-width: %dpx) {' % bp)
        if 'app.css' in path:
            w = 1400 if bp == 1200 else 1560
            block.append('  body { font-size: %.1fpx; }' % (15 * k))
            block.append('  .shell, .topbar-in { max-width: %dpx; }' % w)
            block.append('  .shell { --rail: %dpx; gap: %dpx; }' % (250 if bp == 1200 else 270, 56 if bp == 1200 else 64))
            block.append('  .hero .sub { max-width: 66ch; }  section.sec > .lede { max-width: 72ch; }  .home { max-width: %dpx; }' % (960 if bp == 1200 else 1040))
        for sel, px in found:
            if sel.strip() == 'body': continue
            block.append('  %s { font-size: %.1fpx; }' % (sel, px * k))
        block.append('}')
    block.append(END)
    open(path, 'w', encoding='utf-8').write(css.rstrip() + '\n\n' + '\n'.join(block) + '\n')
    print(path, len(found), 'rules')
