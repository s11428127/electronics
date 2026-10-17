"""電路學 CH1～CH10 複習頁產生器（10/17）：只有故事 ＋ 總結卡。
內容寫在 circuits/docs/rv-pages.json（一章一筆），跑 `python3 tools/rv-pages.py` 重新產生 circuits/chN.html。
故事本身在 circuits/assets/chN-story.js（兩段故事的章節：#story、#story2）。"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPEC = os.path.join(ROOT, 'circuits', 'docs', 'rv-pages.json')

HEAD = '''<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>CH{n} {title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@500;600;700&display=swap">
<link rel="stylesheet" href="../shared/app.css">
<link rel="stylesheet" href="../shared/story.css">
</head>
<body data-subject="circuits" data-look="clean">
<div class="topbar">
  <div class="topbar-in">
    <nav class="crumbs" aria-label="所在位置">
      <a href="../index.html">主頁</a><span>›</span><a href="index.html">電路學</a><span>›</span><b>CH{n} 複習</b>
    </nav>
    <span class="spacer"></span>
    <button class="btn" id="theme-btn" type="button" aria-label="切換明暗主題">明 / 暗</button>
  </div>
</div>
'''


def page(c):
    n = c['n']
    out = [HEAD.format(n=n, title=c['title'], desc=c['desc'])]
    rail = ''.join('      <li><a href="#{sec}"><i>▶</i>{label}</a></li>\n'.format(**p) for p in c['parts'])
    out.append('''
<div class="shell">
  <nav class="rail" aria-label="章節導覽">
    <div class="rail-title">CH{n} 複習</div>
    <ol>
{rail}      <li><a href="#sum"><i>★</i>這章總結</a></li>
    </ol>
  </nav>

  <main>
    <div class="hero">
      <div class="eyebrow"><span class="part-tag">課本 CH{n}</span>Chapter {n} · 複習 · {en}</div>
      <h1>CH{n} {title}</h1>
      <p class="sub">{sub}</p>
      <ol class="rv-ladder" data-cur="{n}"></ol>
    </div>
'''.format(n=n, rail=rail, en=c['en'], title=c['title'], sub=c['sub']))
    for p in c['parts']:
        out.append('''
    <section class="sec" id="{sec}">
      <div class="eyebrow">{eyebrow}</div>
      <h2>{h2}<span class="h2-en">{h2en}</span></h2>
      <div id="{div}"></div>
    </section>
'''.format(**p))
    three = ''.join('          <li>{}</li>\n'.format(t) for t in c['three'])
    eq = ''.join('<span>{}</span>'.format(e) for e in c['eq'])
    notes = ''.join('      <p class="rv-why">{}</p>\n'.format(t) for t in c.get('notes', []))
    out.append('''
    <section class="sec" id="sum">
      <div class="eyebrow">Summary · 看完故事馬上檢查自己</div>
      <h2>這章帶走三件事<span class="h2-en">THREE TAKEAWAYS</span></h2>
      <div class="rv-sum">
        <ol class="rv-three">
{three}        </ol>
        <div class="rv-eq">{eq}<small>{eqsmall}</small></div>
        <div class="rv-next"><span class="k">還缺什麼 →</span><p>{next}</p></div>
      </div>
{notes}      <nav class="rv-nav" data-cur="{n}"></nav>
    </section>
  </main>
</div>

<script src="../shared/app.js"></script>
<script src="../shared/terms.js"></script>
<script src="../shared/story.js"></script>
<script src="assets/ch12-kit.js"></script>
<script src="assets/rv-kit.js"></script>
<script src="assets/rv-nav.js"></script>
<script src="assets/ch{n}-story.js"></script>
<script src="../shared/track.js"></script>
</body>
</html>
'''.format(three=three, eq=eq, eqsmall=c['eqsmall'], next=c['next'], notes=notes, n=n))
    return ''.join(out)


if __name__ == '__main__':
    spec = json.load(open(SPEC, encoding='utf-8'))
    for c in spec:
        path = os.path.join(ROOT, 'circuits', 'ch%d.html' % c['n'])
        open(path, 'w', encoding='utf-8').write(page(c))
        print('wrote', os.path.relpath(path, ROOT))
    # 電路學首頁的「前面單元複習」卡片
    idx = os.path.join(ROOT, 'circuits', 'index.html')
    s = open(idx, encoding='utf-8').read()
    a = s.index('<div class="chapters" id="rv-chaps">') + len('<div class="chapters" id="rv-chaps">')
    b = s.index('\n  </div>', a)
    cards = ''
    for c in spec:
        scenes = sum(int(p['label'].split('（')[1].split(' ')[0]) for p in c['parts'])
        cards += '''
    <a class="chap" href="ch{n}.html">
      <span class="chap-no">CH{n}<em>複習</em></span>
      <span class="chap-body">
        <b>{title}</b>
        <span>{card}</span>
        <span class="chap-tags"><i>▶ {k}{scenes} 個畫面的故事</i><i>★ 總結卡</i></span>
      </span>
      <span class="chap-go">進入 →</span>
    </a>'''.format(n=c['n'], title=c['title'], card=c['card'], scenes=scenes, k='兩段、' if len(c['parts']) > 1 else '')
    open(idx, 'w', encoding='utf-8').write(s[:a] + cards + s[b:])
