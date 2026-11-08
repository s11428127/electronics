/* ============================================================
   英文（Reading Explorer 4）期中考題庫 —— 使用者 11/8
   範圍：Unit 1 + Unit 2 + Unit 3 Reading 1（考試：選擇 60%、單字定義 30%、課外閱讀 10%）
   - 單字：老師 ilearning 單字表的英文定義（docs/VOCAB.md）→ 看定義選字、看字選定義
   - 課本題：答案照老師給的 answer key（docs/KEYS.md）；1A 的 Reading Comprehension 沒拍到題目，只放單字與 Reading Skill／Vocabulary
   - 課文句子題：從課文原句挖空（考卷「有些題目從課文句子中出題」）
   hw.js 卡片：正解寫第一個，選項自動打亂；選項不能有 HTML 標籤
   ============================================================ */
(function () {
  'use strict';
  const items = [];
  let n = {};
  const add = (sec, title, q, o, ex) => {
    n[sec] = (n[sec] || 0) + 1;
    items.push({ id: 'en-' + sec + '-' + n[sec], kind: 'cf', sec, no: n[sec], calc: false, title, q, b: [{ o, a: 0 }], ex: ex || '' });
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /* 固定種子的「挑 3 個錯的」：每次載入一樣，紀錄才對得上 */
  const pick3 = (arr, k) => { const r = []; for (let i = 1; r.length < 3 && i < arr.length + 3; i++) { const x = arr[(k + i * 3) % arr.length]; if (x !== arr[k] && r.indexOf(x) < 0) r.push(x); } return r; };

  /* ═════ 單字（老師的定義） ═════ */
  const V = {
    '1A': [['controversy', 'a strong public disagreement between groups'], ['democracy', 'a form of government in which citizens have the right to vote'], ['dramatic', 'great and sudden'], ['embrace', 'to eagerly accept something'], ['instantly', 'immediately'], ['obsessed', 'thinking or worrying about something too much'], ['profound', 'having a strong influence or effect'], ['relevant', 'relating to something being discussed or considered'], ['represent', 'to show what something is like'], ['tremendous', 'great']],
    '1B': [['enrich', 'to improve or make better'], ['expectation', 'a belief that someone will or should achieve something'], ['overcome', 'to successfully deal with a problem'], ['portrait', 'a painting, drawing, or photograph of a person'], ['project', 'to display an emotion to others'], ['sincere', 'honest; not pretending or lying'], ['teamwork', 'a situation in which people work together'], ['thus', 'therefore'], ['tuition', 'payment for instruction, especially in a college or university'], ['turn out', 'to happen in a particular way']],
    '2A': [['astonishing', 'very surprising'], ['countless', 'very high in number'], ['descend', 'to go down'], ['disturb', 'to move something or to affect it in some way'], ['factor', 'something that affects a result'], ['flash', 'to shine suddenly and brightly for a short time'], ['invisible', 'unable to be seen'], ['layer', 'a thin sheet of a substance'], ['predator', 'an animal that kills and eats other animals'], ['transparent', 'able to be seen through']],
    '2B': [['absurd', 'very strange'], ['bounce', 'to hit a surface and then move away from it'], ['breed', 'to mate and have babies'], ['commence', 'to begin'], ['evolution', 'the way in which living things change and develop over time'], ['harsh', 'cruel or severe'], ['noble', 'having fine personal qualities or appearance'], ['prominently', 'in a very noticeable way'], ['ritual', 'a ceremony that is always performed in the same way'], ['undergo', 'to experience something necessary or unpleasant']],
    '3A': [['compulsory', 'required by law or a rule'], ['confine', 'to keep within a certain area'], ['contaminate', 'to make something dirty or harmful because of dirt, chemicals, or radiation'], ['determine', 'to discover the facts or truth about something'], ['digestion', "the body's system of breaking down food"], ['feasible', 'possible; able to be done'], ['infect', 'to affect with disease-producing germs'], ['integral', 'being an essential part of something'], ['nationwide', 'happening or existing in all parts of a country'], ['optimistic', 'hopeful and confident about the future']],
    'x1': [['aspiring', 'wishing to become successful'], ['scrapbook', 'a book with empty pages where you can stick newspaper articles'], ['invisibility', 'the fact of being impossible to see, or of not being noticed'], ['unguarded', 'not protected'], ['publisher', 'an organization that publishes text or music'], ['transform', 'to change completely'], ['citizen journalist', 'an ordinary person without special training who records or writes about news stories'], ['alter', 'change'], ['filter', 'a tool for creating special effects on an image'], ['antique', 'considered to have value because of being beautiful, rare, old'], ['subjective', 'influenced by or based on personal beliefs or feelings'], ['get stuck on', 'unable to do'], ['up against', 'have a very difficult situation or problem to deal with'], ['Big Brother', 'a way of referring to a government, ruler, or person in authority'], ['radical', 'complete or extreme'], ['have in common', 'to share interests, experiences, or other characteristics with someone or something'], ['grateful', 'thankful'], ['fund-raising', 'the act of collecting or producing money for a particular purpose, especially for a charity'], ['happen to', 'something that occurs by chance']],
    'x2': [['bioluminescence', 'the giving out of light by a substance that has not been heated'], ['commonplace', 'happening often'], ['glimmering', 'to shine with a weak light or a light that is not continuous'], ['luminous', 'producing or reflecting bright light'], ['beak', "the hard, pointed part of a bird's mouth"], ['take place', 'happen'], ['peculiarities', 'the quality of being strange or unusual'], ['spectrum', 'the set of colors into which a beam of light can be separated'], ['perpetual', 'happening all the time'], ['fade out', 'it becomes less clear and then disappears'], ['penetrate', 'to move into or through something'], ['startle', 'to do something unexpected that surprises and sometimes worries a person or animal'], ['dart off', 'move into the dark suddenly and quickly'], ['feather', "one of the many soft, light things that cover a bird's body"], ['dense', 'having parts that are close together so that it is difficult to go or see through'], ['costume', 'an outfit, especially for a particular purpose'], ['invertebrate', 'an animal without a backbone'], ['clone', 'to make a copy of something'], ['revert', 'to return to a previous state'], ['venomous', '(of an animal) poisonous'], ['species', 'a group of plants or animals that share similar characteristics'], ['evaporate', 'to cause a liquid to change to a gas'], ['diverse', 'having many different types of things'], ['polyp', 'a small mass of cells that grows in the body, and is usually not harmful']]
  };
  window.__ENV = V;
  Object.keys(V).forEach(u => {
    const L = V[u], words = L.map(x => x[0]), defs = L.map(x => x[1]);
    L.forEach(([w, d], k) => {
      add('v' + u, '看定義選字', '"' + d + '" = {0}', [w].concat(pick3(words, k)));
    });
    L.forEach(([w, d], k) => {
      add('d' + u, '看字選定義', w + ' = {0}', [d].concat(pick3(defs, k)));
    });
  });

  /* ═════ 課本題（答案照 answer key） ═════ */
  const R = (sec, title, q, o, ex) => add(sec, title, q, o, ex);

  /* 1A：Reading Skill／Vocabulary（p.13–14） */
  R('k1A', 'Before You Read A-1', '"to record in written or photographic form" = {0}', ['document', 'amateur', 'photojournalist']);
  R('k1A', 'Before You Read A-2', '"working without being paid; not professional" = {0}', ['amateur', 'document', 'photojournalist']);
  R('k1A', 'Before You Read A-3', '"a reporter who shares news using images" = {0}', ['photojournalist', 'amateur', 'document']);
  R('k1A', 'Before You Read B · Skimming', 'Skim paragraphs A–B. The passage is mainly about how {0}', ['smartphones and apps have allowed anyone to be a photographer', 'the quality of smartphone photos is usually not very good', "many photojournalists don't approve of amateur photography"], '課文快讀 A～B 段。');
  R('k1A', 'Comprehension A1 · Main idea', 'Why are there fewer memorable photographs today? {0}', ['because there are so many good images these days', 'because photo quality has gone down', 'because magazines no longer publish photos', 'because people do not look at photos carefully'], 'Para D。正解照課本；另外三個選項是我補的（課本原選項請對照 p.12）。');
  R('k1A', 'Comprehension A2 · Detail', 'According to the writer, which images matter most today? {0}', ['images that are important to people and can be shared quickly', 'high-quality images of dramatic events', 'traditional images that reflect reality', 'images that are altered to improve our sense of reality'], 'Para E。');
  R('k1A', 'Comprehension A3 · Purpose', 'Why does the writer put "improved" in quotation marks in paragraph F? {0}', ['to show that the writer feels it is questionable whether the picture is truly improved', 'to show it is the exact word from another source', 'to stress that the picture is greatly improved', 'because the reader may not understand the word'], 'Para F。');
  R('k1A', 'Comprehension A4 · Inference', 'Who is the author criticizing in paragraph J? {0}', ['government leaders', 'citizen journalists', 'Big Brother', 'people who alter photos'], 'Para J：keep leaders honest、harder for governments to hide。');
  R('k1A', 'Comprehension A5 · Paraphrase', '"those who produce poetry and those who make shopping lists" means {0}', ['some people will use it for everyday things, others for more creative things', 'it will be useful for shopping and poetry', 'it will be better because of the variety', 'it has limitations compared to written language'], 'Para K。');
  R('k1A', 'Comprehension B · Para A', 'Main idea of paragraph A: {0}', ['Anyone can be an amateur photographer now.', 'More photojournalists are taking smartphone images and uploading them to social media.', 'For big news stories, amateurs often share the first images.', 'Altering photos with apps can mislead people about serious events such as wars.', 'The effect of the increasing number of photographs is still uncertain.']);
  R('k1A', 'Comprehension B · Para C', 'Main idea of paragraph C: {0}', ['More photojournalists are taking smartphone images and uploading them to social media.', 'Anyone can be an amateur photographer now.', 'For big news stories, amateurs often share the first images.', 'Altering photos with apps can mislead people about serious events such as wars.', 'The effect of the increasing number of photographs is still uncertain.']);
  R('k1A', 'Comprehension B · Para E', 'Main idea of paragraph E: {0}', ['For big news stories, amateurs often share the first images.', 'Anyone can be an amateur photographer now.', 'More photojournalists are taking smartphone images and uploading them to social media.', 'Altering photos with apps can mislead people about serious events such as wars.', 'The effect of the increasing number of photographs is still uncertain.']);
  R('k1A', 'Comprehension B · Para G', 'Main idea of paragraph G: {0}', ['Altering photos with apps can mislead people about serious events such as wars.', 'Anyone can be an amateur photographer now.', 'More photojournalists are taking smartphone images and uploading them to social media.', 'For big news stories, amateurs often share the first images.', 'The effect of the increasing number of photographs is still uncertain.']);
  R('k1A', 'Comprehension B · Para L', 'Main idea of paragraph L: {0}', ['The effect of the increasing number of photographs is still uncertain.', 'Anyone can be an amateur photographer now.', 'More photojournalists are taking smartphone images and uploading them to social media.', 'For big news stories, amateurs often share the first images.', 'Altering photos with apps can mislead people about serious events such as wars.']);
  R('k1A', 'Reading Skill A · age', 'age (para A–D) means {0}', ['a period in history', 'how old someone is']);
  R('k1A', 'Reading Skill A · pretty', 'pretty means {0}', ['quite', 'attractive']);
  R('k1A', 'Reading Skill A · appetite', 'appetite means {0}', ['a strong desire', 'physical hunger']);
  R('k1A', 'Reading Skill A · act', 'act means {0}', ['to behave', 'an action']);
  R('k1A', 'Reading Skill A · second', 'second means {0}', ['a 60th of a minute', 'number two in a series']);
  R('k1A', 'Reading Skill A · course', 'course means {0}', ['the direction', 'a class']);
  R('k1A', 'Reading Skill B · capture', '"…makes it easier to capture unguarded moments" — same meaning: {0}', ['NASA is using space telescopes to help capture images of distant planets.', "The capture of the gang's leader should lead to less crime in the city."]);
  R('k1A', 'Reading Skill B · cover', '"Photojournalists using camera apps to cover wars" — same meaning: {0}', ['The local media will cover the results of the election.', 'His photo appeared on the cover of a magazine.']);
  R('k1A', 'Reading Skill B · series', '"…a result of a series of decisions" — same meaning: {0}', ['There has been an unusual series of events.', 'What is the most popular comic book series?']);
  R('k1A', 'Reading Skill B · frame', '"…what to leave in or out of the frame" — same meaning: {0}', ['Look in the camera frame and tell me what you see.', 'It looked like somebody was trying to frame him for the theft.']);
  R('k1A', 'Vocabulary A-1', 'Recent years have seen some {0} changes in photography.', ['dramatic', 'relevant']);
  R('k1A', 'Vocabulary A-2', 'The availability of cell phones has allowed millions of people to {0} photography as a hobby.', ['embrace', 'represent']);
  R('k1A', 'Vocabulary A-3', 'Image-sharing apps allow anyone to share photos {0} with friends and followers online.', ['instantly', 'profoundly']);
  R('k1A', 'Vocabulary A-4', 'Some people become {0} with capturing and documenting every detail of their lives.', ['obsessed', 'tremendous']);
  R('k1A', 'Vocabulary A-5', 'The popularity of image-sharing sites has also raised some {0} issues.', ['controversial', 'obsessive']);
  R('k1A', 'Vocabulary B-1', 'A controversy involves {0} among people.', ['disagreement', 'agreement']);
  R('k1A', 'Vocabulary B-2', 'If a photo represents a place, it {0} what the place is like.', ['shows', "doesn't show"]);
  R('k1A', 'Vocabulary B-3', 'In a democracy, citizens {0} the right to vote.', ['have', "don't have"]);
  R('k1A', 'Vocabulary B-4', 'If the ideas in an old book are relevant today, they {0} matter.', ['still', 'no longer']);
  R('k1A', 'Vocabulary B-5', 'If you feel a tremendous amount of pressure, you feel {0} of pressure.', ['a lot', 'a little bit']);
  R('k1A', 'Vocabulary B-6', 'Something that is profound is felt or experienced very {0}.', ['strongly', 'briefly']);
  R('k1A', 'Vocabulary C-2', 'In the 20th century, many countries held their first {0} elections.', ['democratic', 'athletic', 'genetic', 'dramatic']);
  R('k1A', 'Vocabulary C-1a', "A person's {0} ability may be partly affected by genetic factors.", ['athletic', 'democratic', 'dramatic', 'genetic']);
  R('k1A', 'Vocabulary C-1b', "A person's athletic ability may be partly affected by {0} factors.", ['genetic', 'democratic', 'dramatic', 'athletic']);
  R('k1A', 'Vocabulary C-3', 'In 2011, Amy Weston took a(n) {0} photo of a woman leaping to safety from a burning building.', ['dramatic', 'genetic', 'democratic', 'athletic']);

  /* 1B（p.15、20–22） */
  R('k1B', 'Before You Read', 'small talk = {0}', ['light conversation', 'make people feel comfortable', 'addicted; obsessed', 'amazingly; surprisingly']);
  R('k1B', 'Before You Read', 'put at ease = {0}', ['make people feel comfortable', 'light conversation', 'extremely good; excellent', 'addicted; obsessed']);
  R('k1B', 'Before You Read', 'hooked = {0}', ['addicted; obsessed', 'extremely good; excellent', 'light conversation', 'amazingly; surprisingly']);
  R('k1B', 'Before You Read', 'by some miracle = {0}', ['amazingly; surprisingly', 'extremely good; excellent', 'make people feel comfortable', 'addicted; obsessed']);
  R('k1B', 'Before You Read', 'top-notch = {0}', ['extremely good; excellent', 'amazingly; surprisingly', 'light conversation', 'addicted; obsessed']);
  R('k1B', 'Comprehension 1 · Purpose', 'What is the purpose of paragraph A? {0}', ["to explain how Griffiths' first job helped prepare her for her future career", 'to show how working as a waitress is similar to life as a photographer', "to compare Griffiths' life before and after being a waitress", 'to describe how Griffiths became interested in photography at college']);
  R('k1B', 'Comprehension 2 · Sequence', 'What happened after Griffiths graduated from college? {0}', ['She got a job at the Worthington Daily Globe.', 'She picked up a camera for the first time.', 'She began working at the Minnesota Daily.', 'She started teaching photography.']);
  R('k1B', 'Comprehension 3 · Detail', "Which sentence does NOT describe Griffiths' job at the Globe? {0}", ['She received detailed instructions from her publisher.', 'She learned how to be a patient listener.', 'The experience prepared her well for a job at National Geographic.', 'She was expected to fill the paper with stories that readers wanted.']);
  R('k1B', 'Comprehension 4 · Detail', 'What kind of transportation challenge does Griffiths mention? {0}', ['being forced to land in a remote place', 'having an accident in a fishing boat', 'getting attacked by an elephant', 'getting lost in the ocean in a rubber raft']);
  R('k1B', 'Comprehension 5 · Main idea', 'According to Griffiths, what has life as a photographer taught her? {0}', ['that it is important to get to know people as individuals', 'that language is essential for communication', 'that most people have very different hopes and fears', 'that expressing an opinion is as important as listening']);
  R('k1B', 'Multiple meanings · spent', '"I spent at least a decade…" spent = {0}', ['passed time in a specific way', 'paid money for something']);
  R('k1B', 'Multiple meanings · light', '"flying in light planes" light = {0}', ['not heavy', 'pale; not dark']);
  R('k1B', 'Multiple meanings · back', '"on the back of a friendly whale" back = {0}', ['rear surface of a body', 'in the opposite direction']);
  R('k1B', 'Multiple meanings · spring', '"each spring I tour…" spring = {0}', ['the season after winter', 'to suddenly jump forward']);
  R('k1B', 'Multiple meanings · left', '"the last one percent of wilderness left here" left = {0}', ['remaining', 'went away']);
  R('k1B', 'Multiple meanings · once', '"…once you get to know one of them as an individual" once = {0}', ['as soon as; when', 'one time only']);
  R('k1B', 'Scanning', 'What kind of photographic equipment did her waitress job help pay for? {0}', ['a camera', 'a computer', 'a darkroom', 'a car']);
  R('k1B', 'Scanning', 'For how long was Griffiths employed at the Worthington Daily Globe? {0}', ['two years', 'six months', 'a decade', 'one year']);
  R('k1B', 'Scanning', "What was Bob Gilka's role at National Geographic? {0}", ['director of photography', 'publisher', 'writer', 'photojournalist']);
  R('k1B', 'Scanning', 'Where did Griffiths travel by moped? {0}', ['Bermuda', 'Sydney', 'Mexico', 'the Sea of Galilee']);
  R('k1B', 'Scanning', "Why did Griffiths' goals change later in her career? {0}", ["She wanted her pictures to make a real difference in people's lives.", 'She wanted to earn more money.', 'She wanted to travel less.', 'She was tired of taking beautiful pictures.']);
  R('k1B', 'Vocabulary A', 'Do you want the photo to {0} love, sadness, or joy?', ['project', 'turn out']);
  R('k1B', 'Vocabulary A', 'While new technologies may {0} your photo, you might prefer a simpler portrait.', ['enrich', 'overcome']);
  R('k1B', 'Vocabulary A', 'You might prefer a simpler {0}, even one in black and white.', ['portrait', 'tuition']);
  R('k1B', 'Vocabulary A', 'How your final selfie {0} will thus depend on a number of factors.', ['turns out', 'overcomes']);
  R('k1B', 'Vocabulary A', 'How your final selfie turns out will {0} depend on a number of factors.', ['thus', 'portrait']);
  R('k1B', 'Vocabulary C · thus 同義字', 'Which word is a synonym of "thus"? {0}', ['consequently', 'however', 'although', 'meanwhile']);
  R('k1B', 'Video · A Photographer’s Life', 'What did Griffiths want to be before she got interested in photography? {0}', ['a writer', 'a painter']);
  R('k1B', 'Video', "What benefit did Griffiths' daughter gain from the family's travels? {0}", ['She is now a confident traveler.', 'She can speak several languages.']);
  R('k1B', 'Video', 'What tip does Griffiths give for immersing yourself in a different culture? {0}', ['respecting the local way of life', 'staying away from tourist hotspots']);
  R('k1B', 'Video', 'According to Griffiths, one of the most inspirational parts about photography: {0}', ['It gives you the opportunity to be creative and grow artistically.', 'A good photo can help shape or change public opinion.'], '老師答案 A。');
  R('k1B', 'Video 填空', '"People all over the world are {0} — that you don\'t assume they are going to be the same as we are."', ['different', 'similar', 'friendly', 'connected']);
  R('k1B', 'Video 填空', '"[Photography is] a wonderful, terrible job because you get this opportunity to go out and do it, but then you\'re supposed to do it {0} than it\'s ever been done before."', ['better', 'faster', 'cheaper', 'differently']);

  /* 2A（p.31–33） */
  R('k2A', 'Comprehension 1 · Main idea', 'All life forms with bioluminescence {0}.', ['are able to create light', 'live in or near water', 'use light to attract mates', 'use light to protect themselves']);
  R('k2A', 'Comprehension 2 · Detail', 'Which of these is NOT explained in the passage? {0}', ['why some birds have beaks that glow in the dark', 'why some bioluminescent creatures produce light', 'why invisibility is important to many sea creatures', "how various creatures near the ocean's surface hide themselves"]);
  R('k2A', 'Comprehension 3 · Cohesion', '"These creatures only rise toward the surface at night." should be added to paragraph D {0}', ['after the third sentence', 'after the first sentence', 'after the second sentence', 'after the fourth sentence']);
  R('k2A', 'Comprehension 4', "According to paragraph E, how do certain shrimp in the ocean's upper layers use bioluminescence? {0}", ['as camouflage', 'as a decoy', 'as an alarm', 'as a warning']);
  R('k2A', 'Comprehension 5 · Inference', 'What is meant by the "burglar alarm" effect? {0}', ['Organisms produce light, which attracts the predators of their predators.', 'Light allows predators to spot their prey in total darkness.', 'A sudden flash of light startles predators, allowing their prey to escape.', 'When lit up, tiny organisms such as dinoflagellates can swim faster.']);
  R('k2A', 'T / F / NG', 'Most bioluminescent creatures in the sea live near the surface. {0}', ['NG', 'T', 'F']);
  R('k2A', 'T / F / NG', 'Six hundred meters below the surface, sunlight stops penetrating the ocean. {0}', ['T', 'F', 'NG']);
  R('k2A', 'T / F / NG', 'Dinoflagellates use light to help them find and eat shrimp. {0}', ['F', 'T', 'NG'], 'F：是 shrimp 吃 dinoflagellates。');
  R('k2A', 'T / F / NG', 'Human activity in the Vieques "bio bay" stops dinoflagellates from lighting up. {0}', ['F', 'T', 'NG'], 'F：canoe 的移動反而讓牠們發光。');
  R('k2A', 'T / F / NG', 'Visitors to the Vieques "bio bay" can only see dinoflagellates in the summer. {0}', ['NG', 'T', 'F']);
  R('k2A', 'Concept map 1', 'For reproduction: helps animals attract a {0} (example: ostracods).', ['mate', 'predator', 'shrimp', 'layer']);
  R('k2A', 'Concept map 2', 'For defense: allows animals in the {0} layers of the ocean to hide from predators below.', ['upper', 'deep', 'middle', 'dark']);
  R('k2A', 'Concept map 3', 'Animals can light up their {0} to match the light from above.', ['bellies', 'eyes', 'tails', 'backs']);
  R('k2A', 'Concept map 4', 'For defense: a sudden flash of light can {0} a predator.', ['startle', 'attract', 'feed', 'hide']);
  R('k2A', 'Concept map 5', 'For defense: a sudden flash of light allows the prey animal to {0} (example: deep-sea squid).', ['escape', 'hide', 'attack', 'reproduce'], '老師答案 5. escape。');
  R('k2A', 'Concept map 6', 'For defense: helps attract the predator of a {0} — useful for tiny organisms that swim slowly.', ['predator', 'mate', 'prey', 'layer'], '老師答案 6. predator（「burglar alarm」效應：叫來掠食者的掠食者）。');
  R('k2A', 'Concept map 7', 'Helps attract the predator of a predator — example: {0}', ['dinoflagellates', 'ostracods', 'fireflies', 'squid'], '老師答案 7. dinoflagellates。');
  R('k2A', 'Vocabulary A', 'A(n) {0} variety of sea creatures use bioluminescence.', ['astonishing', 'disturbed']);
  R('k2A', 'Vocabulary A', 'Brittle stars can {0} a green light when they are threatened.', ['flash', 'descend']);
  R('k2A', 'Vocabulary A', 'They flash a green light when they are threatened by {0}.', ['predators', 'layers']);
  R('k2A', 'Vocabulary A', 'When frightened or {0}, these sea cucumbers break off the bioluminescent parts of their bodies.', ['disturbed', 'transparent']);
  R('k2A', 'Vocabulary B', 'When you descend a staircase, you go {0}.', ['down', 'up']);
  R('k2A', 'Vocabulary B', 'If something is transparent, you {0} see through it.', ['can', 'cannot']);
  R('k2A', 'Vocabulary B', 'Something described as countless has a very {0} number.', ['high', 'low']);
  R('k2A', 'Vocabulary B', 'A factor is something that {0}.', ['affects a result', 'is unlikely']);
  R('k2A', 'Vocabulary B', 'The purpose of adding a layer of clothing would likely be to get {0}.', ['warmer', 'wetter']);
  R('k2A', 'Vocabulary B', 'If something is invisible, it {0} be seen.', ['cannot', 'can']);
  R('k2A', 'Word roots -scend', 'The plane began to {0} as it approached its destination.', ['descend', 'ascend', 'transcend', 'crescendo']);
  R('k2A', 'Word roots -scend', "Divers must not {0} too quickly to the water's surface.", ['ascend', 'descend', 'transcend', 'crescendo']);
  R('k2A', 'Word roots -scend', 'Symphonies include softer melodies that build toward a powerful {0}.', ['crescendo', 'ascend', 'descend', 'transcend']);
  R('k2A', 'Word roots -scend', 'Some types of music are able to {0} cultural boundaries and become popular worldwide.', ['transcend', 'descend', 'ascend', 'crescendo']);

  /* 2B（p.34、38–40） */
  R('k2B', 'Before You Read · Skimming', 'Which is NOT covered in "Feathers of Love"? {0}', ['their migration patterns', 'why they have colorful feathers', 'how they show off their feathers', 'threats to their survival'], '老師答案 B：a, b, d 有寫。');
  R('k2B', 'Comprehension 1 · Main idea', 'Why do birds of paradise dance and display their feathers? {0}', ['to attract a mate', 'to frighten away predators', 'to exercise and clean their bodies', 'to show possession of an area']);
  R('k2B', 'Comprehension 2 · Detail', "Which factor is NOT mentioned as a reason for the birds' unusual characteristics? {0}", ['the wide variety of breeding systems', 'the widespread availability of fruit and insects', 'the wide variety of environments', 'the lack of predators']);
  R('k2B', 'Comprehension 3 · Cause and effect', 'Why did so many birds of paradise die in the early 1900s? {0}', ['There was a high demand for feathers to use in European hats.', 'The birds got sick after early interactions with humans.', "Industrial development destroyed the birds' habitat.", "Logging drastically reduced the birds' habitat."]);
  R('k2B', 'Comprehension 4 · Inference', 'Why do local people continue to hunt birds of paradise? {0}', ['to make traditional costumes', 'to eat them', 'to protect smaller birds', 'to keep their numbers down']);
  R('k2B', 'Comprehension 5 · Cohesion', '"However, there may be some good news for the birds." best begins paragraph {0}', ['M', 'E', 'I', 'L']);
  R('k2B', 'Multiple meanings', 'bows (para A) = {0}', ['bends body forward', 'loops or knots']);
  R('k2B', 'Multiple meanings', 'row (para A) = {0}', ['a number of things in a line', 'a noisy argument or fight']);
  R('k2B', 'Multiple meanings', 'stage (para C) = {0}', ['a place where people perform', 'a period or part of an activity']);
  R('k2B', 'Multiple meanings', 'display (para D) = {0}', ['an event or performance meant to entertain', 'to make visible']);
  R('k2B', 'Multiple meanings', 'present (para L) = {0}', ['to cause something', 'a gift']);
  R('k2B', 'Figurative language', '"Covered in soft, black feathers, the noble performer bows deeply to his audience." {0}', ['personification + metaphor', 'simile', 'simile + metaphor', 'none']);
  R('k2B', 'Figurative language', '"He spreads and moves his wings intensely, like a giant butterfly." {0}', ['simile', 'metaphor', 'personification', 'metaphor + personification']);
  R('k2B', 'Figurative language', '"The male Carola\'s parotia, however, is the dance king of the birds of paradise." {0}', ['metaphor + personification', 'simile', 'simile + personification', 'none']);
  R('k2B', 'Figurative language', '"These include one in which he spreads out his feathers like a dress." {0}', ['simile', 'metaphor', 'personification', 'metaphor + personification']);
  R('k2B', 'Figurative language', '"They\'ll keep dancing for as long as the forest offers them a stage." {0}', ['personification + metaphor', 'simile', 'simile + metaphor', 'none']);
  R('k2B', 'Figurative (Living Light)', 'A simile in "Living Light" paragraph C: {0}', ['as black as the night sky', 'some even have a dimmer switch', 'the water is part of the sky', 'a weapon or a veil']);
  R('k2B', 'Figurative (Living Light)', 'A metaphor in paragraph E: {0}', ['some even have a dimmer switch', 'as black as the night sky', 'like trying to swim through syrup', 'looking like meteors']);
  R('k2B', 'Figurative (Living Light)', 'A simile in paragraph G: {0}', ['it would be like trying to swim through syrup', 'some even have a dimmer switch', 'the water is part of the sky', 'as black as the night sky']);
  R('k2B', 'Figurative (Living Light)', 'A simile in "Stars of the Sea": {0}', ['looking like meteors', 'paddling through the stars', 'a dimmer switch', 'as black as the night sky']);
  R('k2B', 'Figurative (Living Light)', 'A metaphor in "Stars of the Sea": {0}', ['the water is part of the sky, and you are paddling through the stars', 'looking like meteors', 'like trying to swim through syrup', 'as black as the night sky']);
  R('k2B', 'Vocabulary A', 'The male Carola\'s parotia has developed a special mating {0}.', ['ritual', 'absurd', 'prominent', 'bounce']);
  R('k2B', 'Vocabulary A', 'On its head, the bird has several long and {0} quills.', ['prominent', 'absurd', 'ritual', 'bounce']);
  R('k2B', 'Vocabulary A', 'Its quills, which it {0} up and down in hopes of attracting a female.', ['bounces', 'ritual', 'absurd', 'prominent']);
  R('k2B', 'Vocabulary A', '"Its mating dance is so {0}," says Jennifer Holland, "that I could hardly keep from laughing."', ['absurd', 'noble', 'prominent', 'harsh']);
  R('k2B', 'Word forms -ility', 'Economic development is more likely during periods of political {0}.', ['stability', 'mobility', 'hostility', 'nobility']);
  R('k2B', 'Word forms -ility', 'Oil is not a {0} energy source in the long term, as supplies are limited.', ['reliable', 'stable', 'hostile', 'mobile']);
  R('k2B', 'Word forms -ility', 'Communication breakdowns can produce a {0} environment in the workplace.', ['hostile', 'reliable', 'noble', 'stable']);
  R('k2B', 'Word forms -ility', 'The availability of cars in the 20th century led to an increase in personal {0}.', ['mobility', 'stability', 'nobility', 'reliability']);
  R('k2B', 'Video · Jellyfish', 'Some scientists have started using the umbrella term "{0}" instead of jellyfish.', ['sea jellies', 'sea stars', 'medusae', 'sea bells']);
  R('k2B', 'Video · Jellyfish', 'The "immortal jellyfish" can revert back to a {0} and start its life cycle again.', ['polyp', 'larva', 'clone', 'egg']);
  R('k2B', 'Video · Jellyfish', 'The Australian box jellyfish is considered to be the most {0} marine animal in the world.', ['venomous', 'transparent', 'ancient', 'diverse']);
  R('k2B', 'Video · Jellyfish', 'Jellyfish are mostly made of {0}; if one washes ashore, it will mostly evaporate.', ['water', 'protein', 'salt', 'bone']);
  R('k2B', 'Video · Jellyfish', 'Jellyfish blooms have clogged fishing gear, destroyed ships, and closed {0}.', ['beaches', 'factories', 'schools', 'airports']);

  /* 3A（p.44、48–50） */
  R('k3A', 'Before You Read', '"clean and not dangerous for your health" = {0}', ['sanitary', 'bacteria', 'immune systems', 'foodborne']);
  R('k3A', 'Before You Read', '"very small organisms that can cause disease" = {0}', ['bacteria', 'sanitary', 'immune systems', 'foodborne']);
  R('k3A', 'Before You Read', '"parts and processes of the body that fight illness" = {0}', ['immune systems', 'bacteria', 'foodborne', 'sanitary']);
  R('k3A', 'Before You Read', '"carried into our bodies through the things we eat" = {0}', ['foodborne', 'sanitary', 'bacteria', 'immune systems']);
  R('k3A', 'Comprehension 1 · Gist', 'What is the reading mainly about? {0}', ['sources of dangerous foodborne bacteria, their detection, and control', 'new research regarding the effects of foodborne bacteria', 'the decline in sanitary conditions in restaurants and farms around the world', 'the importance of advanced technology in the fight against foodborne bacteria']);
  R('k3A', 'Comprehension 2 · Detail', 'Why is even a single disease-causing bacterium dangerous? {0}', ['It can multiply very quickly.', 'It can mix with other bacteria.', 'It is often hard to detect.', 'Just one can kill a small child.']);
  R('k3A', 'Comprehension 3 · Purpose', 'What is PulseNet used for? {0}', ['to match cases of foodborne illness that have the same source', 'to identify restaurants with poor sanitary conditions', 'to connect patients who have foodborne illnesses with doctors', 'to record best practices in food production methods']);
  R('k3A', 'Comprehension 4 · Detail', 'Why are people eating more imported food now? {0}', ['People want to have certain foods year-round.', 'Imported foods are usually cheaper.', 'Imported foods are usually safer.', 'Consumers have more sophisticated tastes.']);
  R('k3A', 'Comprehension 5 · Paraphrase', '"The farmers we\'ve trained will become models for all our growers." means {0}', ['More farmers will adopt the habits that were taught to the trained farmers.', 'The farmers will go on TV to talk about what they learned from her.', 'Both farmers and growers will now work together to assure food safety.', 'Farmers need to listen to the growers to learn and decide what works for them.']);
  R('k3A', 'T / F / NG (para G)', 'The salmonella outbreak in 2000 first affected people in Virginia. {0}', ['NG', 'T', 'F']);
  R('k3A', 'T / F / NG (para G)', 'Everyone affected by that outbreak had eaten mangoes in the previous months. {0}', ['T', 'F', 'NG']);
  R('k3A', 'T / F / NG (para G)', 'The outbreak was investigated by the Centers for Disease Control and Prevention. {0}', ['T', 'F', 'NG']);
  R('k3A', 'T / F / NG (para G)', 'The salmonella outbreak was caused by farmers not washing their mangoes. {0}', ['F', 'T', 'NG'], 'F：是用受汙染的水洗芒果。');
  R('k3A', 'T / F / NG (para G)', 'Salmonella can contaminate several different kinds of food. {0}', ['T', 'F', 'NG']);
  R('k3A', 'Cause → effect', 'cutting open a food animal during processing → {0}', ['meat can be contaminated by the bacteria inside', 'the death of two people', 'greater dependence on imports', 'fewer cases of contaminated produce']);
  R('k3A', 'Cause → effect', 'the use of "factory" farms → {0}', ['bacteria will likely spread from animal to animal', 'the death of two people', 'fewer cases of contaminated produce', 'greater dependence on imports'], '請確認：老師答案卷寫 2. b、3. e，但照課文（para D、G）應該是 2 → e、3 → b，可能是答案卷打錯。');
  R('k3A', 'Cause → effect', 'a salmonella outbreak linked to mangoes → {0}', ['the death of two people', 'bacteria will likely spread from animal to animal', 'greater dependence on imports', 'meat can be contaminated by the bacteria inside'], '請確認：答案卷寫 3. e；課文 para G「two had died」→ b。');
  R('k3A', 'Cause → effect', 'all-year demand for fresh fruits and vegetables → {0}', ['greater dependence on imports', 'fewer cases of contaminated produce', 'the death of two people', 'bacteria will likely spread from animal to animal']);
  R('k3A', 'Cause → effect', 'improving sanitary conditions on farms → {0}', ['fewer cases of contaminated produce', 'greater dependence on imports', 'meat can be contaminated by the bacteria inside', 'the death of two people']);
  R('k3A', 'Cause (underline) 1', '"I didn\'t go to the doctor because I forgot about the appointment." The cause is {0}', ['I forgot about the appointment', 'I didn\'t go to the doctor'], '老師答案：I forgot about the appointment（because 後面就是原因）。');
  R('k3A', 'Cause (underline) 2', '"The medicine in our cabinet was old, so we threw it out." The cause is {0}', ['the medicine was old', 'we threw it out']);
  R('k3A', 'Cause (underline) 3', '"The reason I didn\'t go to school was that I had a stomachache." The cause is {0}', ['I had a stomachache', 'I didn\'t go to school'], '老師答案：I had a stomachache（The reason … was that 後面是原因）。');
  R('k3A', 'Cause (underline) 4', '"Due to new health guidelines, all food will be removed from the staff fridge on weekends." The cause is {0}', ['new health guidelines', 'food will be removed']);
  R('k3A', 'Cause (underline) 5', '"Investigators believe improper hand washing caused the disease outbreak at the school." The cause is {0}', ['improper hand washing', 'the disease outbreak at the school', 'investigators believe'], '老師答案：Improper hand washing（A caused B → A 是原因）。');
  R('k3A', 'Critical thinking', 'Costa Rica: focus on safer farming of {0}', ['fruits and vegetables', 'chickens', 'cattle', 'fish']);
  R('k3A', 'Critical thinking', 'Sweden: focus on safer farming of {0}', ['chickens', 'fruits and vegetables', 'mangoes', 'cattle']);
  R('k3A', 'Vocabulary A-1', '"required by law or a rule" = {0}', ['compulsory', 'integral', 'nationwide', 'determined']);
  R('k3A', 'Vocabulary A-2', '"being an essential part of something" = {0}', ['integral', 'compulsory', 'nationwide', 'determined']);
  R('k3A', 'Vocabulary A-3', '"happening or existing in all parts of a country" = {0}', ['nationwide', 'compulsory', 'integral', 'determined']);
  R('k3A', 'Vocabulary A-4', '"discovered the facts or truth about something" = {0}', ['determined', 'compulsory', 'integral', 'nationwide']);
  R('k3A', 'Vocabulary A-5', '"dirty or harmful because of dirt, chemicals, or radiation" = {0}', ['contaminated', 'compulsory', 'integral', 'nationwide']);
  R('k3A', 'Vocabulary A-6', '"the process of bacteria or viruses invading the body and making someone ill" = {0}', ['infection', 'compulsory', 'integral', 'nationwide']);
  R('k3A', 'Vocabulary B', 'If contamination is confined, it {0}.', ['occurs within a certain area', 'has spread to many areas']);
  R('k3A', 'Vocabulary B', "Digestion is the body's system of {0}.", ['breaking down food', 'fighting disease']);
  R('k3A', 'Vocabulary B', 'If a project is feasible, it {0} be done.', ['can', 'cannot']);
  R('k3A', 'Vocabulary B', 'An optimistic person believes that the future will be {0} than today.', ['better', 'worse']);
  R('k3A', 'Word parts -wide', 'The outbreak was confined to the U.S.; it affected 12 states {0}wide.', ['nation', 'city', 'world', 'company']);
  R('k3A', 'Word parts -wide', 'Shanghai has implemented a {0}wide smoking ban in all its public parks.', ['city', 'nation', 'world', 'company']);
  R('k3A', 'Word parts -wide', 'Affecting millions of people {0}wide, malaria is particularly prevalent in tropical countries.', ['world', 'nation', 'city', 'company']);

  /* ═════ 課文原句挖空（自編） ═════ */
  const C = (sec, q, o, ex) => add(sec, '課文原句', q, o, ex);
  /* 1B My Journey in Photographs */
  C('c1B', 'I got my first real job at age {0}, as a waitress.', ['12', '16', '18', '10']);
  C('c1B', 'I am {0} that I learned more as a waitress than I ever did in a classroom.', ['convinced', 'obsessed', 'grateful', 'hooked'], '筆記：convinced = persuaded。');
  C('c1B', 'When I went on to college, it also paid for {0} and housing.', ['tuition', 'teamwork', 'portraits', 'expectations']);
  C('c1B', 'Waiting tables also taught me {0} and service and humor.', ['teamwork', 'tuition', 'evolution', 'digestion']);
  C('c1B', 'From the moment I picked up a camera, I was {0}.', ['hooked', 'hired', 'startled', 'confined']);
  C('c1B', 'By some {0} I was hired, and the two-year experience was like a master class in photojournalism.', ['miracle', 'ritual', 'factor', 'portrait']);
  C('c1B', 'Jim Vance was the top-notch publisher of the Globe. He had very high {0} of all the staff.', ['expectations', 'tuition', 'portraits', 'rituals']);
  C('c1B', 'Paul had lived through personal tragedy, so he was able to {0} warmth and understanding to anyone he met.', ['project', 'confine', 'descend', 'infect'], 'project = to display an emotion to others。');
  C('c1B', 'From Paul I learned the importance of giving each subject time and {0} attention.', ['sincere', 'absurd', 'harsh', 'compulsory']);
  C('c1B', 'I {0} my nervousness and said, "Yes, sir."', ['overcame', 'underwent', 'determined', 'enriched']);
  C('c1B', 'Bob Gilka asked for a picture of {0} damage.', ['hail', 'storm', 'flood', 'fire']);
  C('c1B', '{0} began one of the most important relationships of my life.', ['Thus', 'Although', 'However', 'Unless']);
  C('c1B', 'I was the youngest photographer working for National Geographic when I arrived in {0}.', ['1978', '1987', '1968', '2000']);
  C('c1B', 'On many assignments, the most challenging part {0} to be the transportation.', ['turned out', 'took place', 'happened to', 'faded out']);
  C('c1B', 'In a rubber raft off the west coast of Mexico, I was lifted out of the water on the back of a friendly {0}.', ['whale', 'elephant', 'shark', 'mule']);
  C('c1B', 'Each spring I tour two or three developing countries, shooting {0} of people.', ['portraits', 'tuition', 'layers', 'predators']);
  C('c1B', 'I have traveled all over the United States to photograph the last {0} of wilderness left here.', ['one percent', 'ten percent', 'half', 'quarter']);
  C('c1B', 'Judging others does great harm, but listening to them {0}.', ['enriches', 'disturbs', 'contaminates', 'confines']);
  C('c1B', 'I have learned that women really do hold up half the {0}.', ['sky', 'world', 'house', 'earth']);
  /* 2A Living Light */
  C('c2A', 'The ability of some species to create light is both magical and {0}.', ['commonplace', 'absurd', 'compulsory', 'invisible']);
  C('c2A', 'On land the most familiar examples are fireflies, {0} to attract mates on a warm summer night.', ['flashing', 'descending', 'bouncing', 'breeding']);
  C('c2A', 'Even some birds, such as the Atlantic {0}, have beaks that glow in the dark.', ['puffin', 'parotia', 'pigeon', 'parrot']);
  C('c2A', 'Here, an {0} number of beings can make light.', ['astonishing', 'invisible', 'integral', 'optimistic']);
  C('c2A', 'Of all the groups of organisms known to make light, more than {0} live in the ocean.', ['four-fifths', 'half', 'one-third', 'two-thirds']);
  C('c2A', 'There is almost nowhere to hide, so being {0} is very important.', ['invisible', 'transparent', 'luminous', 'noble']);
  C('c2A', 'As you {0}, sunlight disappears. At first, red light is absorbed.', ['descend', 'ascend', 'commence', 'flash']);
  C('c2A', 'At 200 meters below the surface, the ocean becomes a kind of perpetual {0}.', ['twilight', 'darkness', 'spectrum', 'layer']);
  C('c2A', 'At {0} meters the blue fades out too.', ['600', '200', '1,000', '400']);
  C('c2A', 'These {0} make light uniquely useful as a weapon or a veil.', ['factors', 'layers', 'predators', 'rituals']);
  C('c2A', "In the ocean's upper {0}, where light penetrates, creatures need to blend in to survive.", ['layers', 'factors', 'costumes', 'flashes']);
  C('c2A', 'Jellyfish and swimming snails are {0}, ghostlike creatures, almost impossible to see.', ['transparent', 'venomous', 'astonishing', 'prominent']);
  C('c2A', 'Certain shrimp and squid illuminate their bellies to match the light coming from {0}.', ['above', 'below', 'the side', 'the moon']);
  C('c2A', 'Why do some creatures light up when they are touched, or when the water nearby is {0}?', ['disturbed', 'contaminated', 'confined', 'determined']);
  C('c2A', 'Giving off light can help summon the {0} of your predator.', ['predator', 'mate', 'prey', 'enemy']);
  C('c2A', 'For tiny organisms, water is too {0} to allow a quick getaway — like trying to swim through syrup.', ['viscous', 'transparent', 'dense', 'perpetual']);
  C('c2A', 'Vieques is home to {0} dinoflagellates.', ['countless', 'astonishing', 'invisible', 'transparent']);
  C('c2A', 'Dinos means "{0}" in Greek.', ['whirling', 'shining', 'tiny', 'star']);
  C('c2A', 'Making light is such a useful trait that it has evolved independently at least {0} times.', ['40', '4', '90', '200']);
  /* 2B Feathers of Love */
  C('c2B', 'Covered in soft, black feathers, the {0} performer bows deeply to his audience.', ['noble', 'absurd', 'harsh', 'sincere']);
  C('c2B', 'He pauses for dramatic effect, then {0} his dance again.', ['commences', 'undergoes', 'breeds', 'descends']);
  C('c2B', 'His neck sinks and his head goes up and down, head feathers {0}.', ['bouncing', 'flashing', 'breeding', 'descending']);
  C('c2B', "In the dense jungle of New Guinea is nature's most {0} theater.", ['absurd', 'noble', 'harsh', 'transparent'], '筆記：absurd = 荒謬的、不合理的。');
  C('c2B', 'The male red bird of paradise shows off his feathers in a display called a "{0} dance."', ['butterfly', 'ballerina', 'king', 'stage']);
  C('c2B', 'Male Goldie\'s birds {0} display the soft red feathers that rise from their backs.', ['prominently', 'instantly', 'profoundly', 'sincerely']);
  C('c2B', 'Of today\'s {0} brightly colored birds of paradise species, most live only on New Guinea.', ['45', '40', '90', '80']);
  C('c2B', 'Such extreme feathers and colors could have been favored by the process of {0}.', ['evolution', 'digestion', 'infection', 'revolution']);
  C('c2B', 'Under {0} conditions, "evolution simply wouldn\'t have come up with these birds."', ['harsher', 'nobler', 'denser', 'safer']);
  C('c2B', 'Fruit and insects are {0} all year round, and predators are few.', ['abundant', 'rare', 'invisible', 'compulsory']);
  C('c2B', 'Over millions of years, they have slowly {0} changes in their colors, feathers, and other talents.', ['undergone', 'overcome', 'commenced', 'determined']);
  C('c2B', 'Locals went into the forest and copied their {0} from the birds.', ['rituals', 'costumes', 'factors', 'portraits'], '筆記：ritual = 儀式、典禮。');
  C('c2B', 'At the peak of the trade in the early 1900s, {0} skins a year were exported from New Guinea.', ['80,000', '8,000', '40,000', '800,000']);
  C('c2B', 'Local people usually target older male birds, leaving younger males to continue {0}.', ['breeding', 'bouncing', 'dancing', 'hunting']);
  C('c2B', 'Logging, oil prospecting, and {0} also present dangers to New Guinea\'s forests.', ['mining', 'hunting', 'tourism', 'farming']);
  C('c2B', 'David Mitchell, a {0}, is relying on the help of local villagers.', ['conservationist', 'biologist', 'anthropologist', 'photographer']);
  C('c2B', "They'll keep dancing for as long as the forest offers them a {0}.", ['stage', 'home', 'costume', 'mate']);
  /* 3A How Safe Is Our Food? */
  C('c3A', 'Each year in the United States, {0} people suffer from foodborne diseases.', ['48 million', '128,000', '3,000', 'half a million']);
  C('c3A', 'In the developing world, {0} food and water kill over half a million children a year.', ['contaminated', 'integral', 'feasible', 'nationwide']);
  C('c3A', 'Bacteria are an {0} part of a healthy life.', ['integral', 'optimistic', 'compulsory', 'feasible']);
  C('c3A', 'Most of these bacteria help with {0}, making vitamins, and shaping the immune system.', ['digestion', 'infection', 'evolution', 'contamination']);
  C('c3A', 'A single bacterium divides rapidly enough to produce {0} over the course of a day.', ['billions', 'thousands', 'hundreds', 'dozens']);
  C('c3A', 'Giant "factory" farms {0} large numbers of animals in tight spaces.', ['confine', 'determine', 'infect', 'enrich']);
  C('c3A', 'Patricia Griffin, of the {0}, has worked in the foodborne-disease business for 15 years.', ['Centers for Disease Control and Prevention', 'University of Costa Rica', 'World Health Organization', 'National Geographic']);
  C('c3A', 'PulseNet matches types of bacteria using {0} analysis.', ['DNA', 'blood', 'water', 'soil']);
  C('c3A', "It's the job of the investigators to {0} what went wrong in the food's journey to the table.", ['determine', 'confine', 'contaminate', 'project']);
  C('c3A', 'The CDC identified 79 patients in 13 states who were {0} with the same type of salmonella.', ['infected', 'confined', 'determined', 'disturbed']);
  C('c3A', 'The investigation led to a single large mango farm in {0}.', ['Brazil', 'Costa Rica', 'Mexico', 'Sweden']);
  C('c3A', 'Costa Rica has made sanitary production of fruits and vegetables a {0} priority.', ['nationwide', 'worldwide', 'citywide', 'compulsory']);
  C('c3A', 'Frequent hand washing is {0}.', ['compulsory', 'feasible', 'optimistic', 'integral']);
  C('c3A', 'Such changes have made Carmela Velazquez {0} about the future.', ['optimistic', 'obsessed', 'compulsory', 'contaminated']);
  C('c3A', 'Swedish chicken farmers have eliminated salmonella by using chicken feed that has been {0}.', ['heated', 'washed', 'imported', 'frozen']);
  C('c3A', 'These successes suggest that it is indeed {0} to produce safe and sanitary food while still making a profit.', ['feasible', 'compulsory', 'invisible', 'absurd']);

  window.__ENG1 = { name: 'eng-mid1', items };
})();
