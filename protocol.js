/* Protocol Score assessment. Questions and scoring are carried over unchanged from the original site. */
(function () {
  'use strict';
  var Q = [
    { q: "How do you sleep, honestly?", opts: [
      { t: "Deep and restorative most nights", p: 3 }, { t: "Okay, but never quite enough", p: 2 }, { t: "Broken, restless, or light", p: 1 }, { t: "I wake up tired no matter what", p: 0 }] },
    { q: "Your energy through the day?", opts: [
      { t: "Steady and reliable", p: 3 }, { t: "Dips, but I manage", p: 2 }, { t: "Crashes by the afternoon", p: 1 }, { t: "Running on fumes most days", p: 0 }] },
    { q: "Can you rest without guilt?", opts: [
      { t: "Yes, I recover well", p: 3 }, { t: "Sometimes", p: 2 }, { t: "Rarely, rest makes me restless", p: 1 }, { t: "Never, stopping feels like failing", p: 0 }] },
    { q: "How consistent is your training or routine?", opts: [
      { t: "Rock solid", p: 3 }, { t: "Mostly there", p: 2 }, { t: "I start strong, then fall off", p: 1 }, { t: "All or nothing, usually nothing", p: 0 }] },
    { q: "Does your plan survive real life?", opts: [
      { t: "Always, it bends and holds", p: 3 }, { t: "Usually", p: 2 }, { t: "It breaks when life gets messy", p: 1 }, { t: "One bad week and it's gone", p: 0 }] },
    { q: "Wired but tired? Can you switch off?", opts: [
      { t: "Rarely an issue", p: 3 }, { t: "Sometimes", p: 2 }, { t: "Often, my mind races", p: 1 }, { t: "Constantly, I can't come down", p: 0 }] },
    { q: "Which sounds most like you?", seg: true, opts: [
      { t: "An executive or founder running on empty", s: "executive" }, { t: "A parent with nothing left at the end of the day", s: "parent" },
      { t: "An athlete chasing consistency", s: "athlete" }, { t: "A high performer quietly burnt out", s: "highperformer" }] }
  ];
  var SEG = {
    executive: { label: "the executive on empty", url: "/executive-burnout-coaching" },
    parent: { label: "the exhausted parent", url: "/coaching-for-parents" },
    athlete: { label: "the inconsistent athlete", url: "/athlete-consistency" },
    highperformer: { label: "the high performer hiding burnout", url: "/high-performer-burnout" }
  };
  var i = 0, score = 0, seg = "highperformer";
  var $ = function (id) { return document.getElementById(id); };
  var intro = $('pscoreIntro'), quiz = $('pscoreQuiz'), result = $('pscoreResult');

  function render() {
    var item = Q[i];
    $('pscoreStep').textContent = 'Question ' + (i + 1) + ' of ' + Q.length;
    $('pscoreBar').style.width = (i / Q.length * 100) + '%';
    $('pscoreQ').textContent = item.q;
    var box = $('pscoreOpts'); box.innerHTML = '';
    item.opts.forEach(function (o) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'qopt'; b.textContent = o.t;
      b.addEventListener('click', function () {
        if (item.seg) { seg = o.s; } else { score += o.p; }
        i++; if (i < Q.length) { render(); } else { finish(); }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      box.appendChild(b);
    });
  }

  function finish() {
    var pct = Math.round(score / 18 * 100);
    var band, msg;
    if (pct >= 70) { band = 'Strong foundation'; msg = "Your foundation is solid. The work now is sharpening the edge, not rebuilding the base. There is real performance to unlock here."; }
    else if (pct >= 40) { band = 'Fraying at the edges'; msg = "You are holding it together, but the foundation is fraying. This is the moment to fix it, before a bad block or a hard quarter turns it into a breakdown."; }
    else { band = 'Running in the red'; msg = "You are running in the red. This is exactly where recovery-led coaching starts, and exactly why pushing harder has not worked. The answer was never more."; }
    quiz.classList.add('hidden-step'); result.classList.remove('hidden-step');
    $('pscoreBand').textContent = band;
    $('pscoreMsg').textContent = msg;
    var s = SEG[seg];
    $('pscoreSeg').innerHTML = 'Sounds like you: ' + s.label + '. <a href="' + s.url + '">See how the protocol fits you &rsaquo;</a>';
    $('pscoreHidden').value = pct;
    $('psegHidden').value = seg;
    var ring = $('pscoreRing');
    ring.style.setProperty('--v', pct);
    requestAnimationFrame(function () { requestAnimationFrame(function () { ring.style.strokeDashoffset = (100 - pct); }); });
    var n = 0, step = Math.max(1, Math.round(pct / 30)), numEl = $('pscoreNum');
    var t = setInterval(function () { n += step; if (n >= pct) { n = pct; clearInterval(t); } numEl.textContent = n; }, 28);
  }

  var begin = $('pscoreBegin');
  if (begin) begin.addEventListener('click', function () { intro.classList.add('hidden-step'); quiz.classList.remove('hidden-step'); render(); });
})();
