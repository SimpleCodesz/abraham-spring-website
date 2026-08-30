import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const reviewed = '30 August 2026';
const isoDate = '2026-08-30';

const articles = [
  {
    slug: 'what-is-adhd-coaching', theme: 'adhd', tag: 'ADHD coaching', eyebrow: 'Clarity · structure · follow-through', read: '9 min read',
    title: 'What Is ADHD Coaching? A Practical Guide | Abraham Spring',
    h1: 'What Is ADHD Coaching—and What Should It Actually Help You Do?',
    description: 'ADHD coaching explained clearly: what happens in sessions, what it can support, where its limits sit and how to decide whether it fits your needs.',
    deck: 'ADHD coaching is not another place to be told to try harder. Done well, it helps turn insight into visible systems, smaller decisions and repeatable follow-through.',
    image: 'adhd-coaching-editorial.webp', alt: 'Abraham Spring running beside the lake at Blenheim Palace', destination: '/adhd-coaching', nav: 'ADHD coaching',
    answerTitle: 'The short answer',
    answer: '<p>ADHD coaching is a collaborative, non-clinical process focused on how you plan, start, prioritise, remember and complete the things that matter. It can help you build external structure around attention and executive-function challenges. It does not diagnose ADHD, prescribe medication or replace psychological or medical care.</p>',
    sections: [
      ['Why ordinary productivity advice often fails', '<p>“Be more disciplined” assumes the missing ingredient is effort. Many adults with ADHD already expend enormous effort. The friction is often between intention and activation: knowing what matters but struggling to begin, holding too many steps in working memory, or losing the plan when the context changes.</p><p>The NHS notes that adults with ADHD may find organisation, following instructions, finishing tasks and remembering belongings difficult. Coaching starts with that lived friction rather than treating it as a character flaw.</p>'],
      ['What happens in an ADHD coaching session', '<p>A useful session moves from the specific to the practical. You might identify one outcome, map where the process breaks down, reduce the number of hidden decisions and agree a small experiment for the week.</p><ol><li><strong>Clarify:</strong> define what “done” means.</li><li><strong>Externalise:</strong> move the plan out of memory and into a visible system.</li><li><strong>Reduce friction:</strong> change the environment, sequence or starting step.</li><li><strong>Review:</strong> learn from what happened without turning the review into a verdict on you.</li></ol><p>The coach is not there to become your permanent reminder system. The work is to build supports you can understand, adapt and eventually own.</p>'],
      ['What ADHD coaching can support', '<p>Common coaching targets include planning a realistic week, breaking ambiguous projects into starts, protecting recovery, designing transitions, preparing difficult conversations, and creating accountability that does not depend on shame.</p><p>NICE recognises that environmental modifications can reduce impairment for some people with ADHD. In coaching language, that means changing the conditions—not simply demanding more concentration inside the same conditions.</p>'],
      ['What it cannot do', '<p>Only an appropriately qualified healthcare professional can diagnose ADHD. Medication must be started and monitored by an ADHD specialist. Coaching is also not therapy: it is not the right container for treating trauma, severe anxiety, depression, addiction or crisis.</p><div class="scope-box"><h2>Scope matters</h2><p>If you suspect ADHD and do not have a diagnosis, speak with your GP or an appropriate specialist. Coaching can sit alongside clinical care, but it should never present itself as clinical care.</p></div>'],
      ['How to choose an ADHD coach', '<p>Ask how the coach defines scope, what a session produces, how progress is reviewed and what happens when the issue belongs in therapy or healthcare. Look for specificity rather than grand promises. A credible coach should be comfortable saying “this is outside coaching”.</p><p>The fit is not about finding someone who will run your life. It is about finding someone who can help you see the pattern, build the right support and keep your agency intact.</p>']
    ],
    faqs: [['Do I need an ADHD diagnosis to use coaching?','Not necessarily, provided the work is clearly non-clinical. Coaching cannot confirm or rule out ADHD; concerns about diagnosis belong with a qualified healthcare professional.'],['Is ADHD coaching the same as accountability?','Accountability can be one component, but useful coaching also examines task design, environment, capacity, transitions and recovery.'],['Can coaching replace ADHD medication?','No. Medication decisions belong with an ADHD specialist. Coaching may complement clinical care by supporting practical implementation in daily life.']],
    sources: [['NHS: ADHD in adults','https://www.nhs.uk/conditions/adhd-adults/'],['NICE guideline NG87: ADHD diagnosis and management','https://www.nice.org.uk/guidance/ng87/chapter/recommendations'],['NICE: ADHD guideline context','https://www.nice.org.uk/guidance/NG87/chapter/context']],
    ctaTitle: 'Build systems that work on the day you actually have.', cta: 'ADHD coaching can help turn overloaded intentions into visible priorities, workable starts and a recovery-aware weekly structure.', related: [['ADHD and therapy','/blog/adhd-coaching-vs-therapy'],['Performance coaching','/performance-coaching'],['Consistency','/athlete-consistency']]
  },
  {
    slug: 'adhd-coaching-vs-therapy', theme: 'adhd', tag: 'ADHD coaching', eyebrow: 'Scope · support · right fit', read: '9 min read',
    title: 'ADHD Coaching vs Therapy: What Each Is For | Abraham Spring',
    h1: 'ADHD Coaching vs Therapy: What Each Is For—and When You May Need Both',
    description: 'A clear ADHD coaching versus therapy comparison covering goals, scope, session focus, clinical boundaries and how the two forms of support can work together.',
    deck: 'The useful question is not which profession “wins”. It is whether your present need is practical implementation, psychological treatment—or a coordinated combination of both.',
    image: 'adhd-coaching-vs-therapy-editorial.webp', alt: 'Abraham Spring riding uphill during the Blenheim Palace Triathlon', destination: '/adhd-coaching', nav: 'ADHD coaching',
    answerTitle: 'Coaching and therapy solve different problems',
    answer: '<p>ADHD coaching usually focuses on present-to-future action: planning, prioritisation, routines, accountability and environmental design. Therapy is delivered by a qualified mental-health professional and can assess and treat psychological distress, trauma, anxiety, depression and other clinical concerns. Some people benefit from both, with clear roles and communication.</p>',
    sections: [
      ['The practical difference', '<table class="comparison-table"><thead><tr><th>ADHD coaching</th><th>Therapy</th></tr></thead><tbody><tr><td>Builds practical systems and experiments</td><td>Assesses and treats psychological difficulties</td></tr><tr><td>Often present-to-future focused</td><td>May explore past and present patterns</td></tr><tr><td>Non-clinical scope</td><td>Clinical scope depends on practitioner and modality</td></tr><tr><td>Does not diagnose or prescribe</td><td>Qualified clinicians may diagnose within their professional scope; prescribers manage medication</td></tr></tbody></table>'],
      ['When coaching may fit', '<p>Coaching may fit when you understand the issue but cannot reliably translate that understanding into action. Examples include building a weekly planning system, reducing forgotten commitments, creating a start ritual for complex work, or adjusting training around fluctuating capacity.</p><p>The output should be observable: a simpler workflow, a protected recovery boundary, a more realistic calendar or a repeatable review process.</p>'],
      ['When therapy is the right lead', '<p>Therapy should lead when the central issue is trauma, persistent low mood, severe anxiety, disordered eating, addiction, relationship distress, self-harm, suicidal thoughts or another mental-health concern. It may also be appropriate when shame and emotional pain repeatedly overwhelm practical strategies.</p><p>NICE recommends structured supportive psychological intervention for adults with ADHD when non-pharmacological treatment is indicated. That is healthcare, not a service a coach should quietly relabel.</p>'],
      ['When both can work together', '<p>A therapist may help someone understand and treat anxiety while a coach helps translate agreed priorities into a workable week. The two roles should not blur. You should know who is responsible for clinical risk, what information is shared, and what each relationship is trying to achieve.</p><blockquote>More support is not automatically better. Clearer support is.</blockquote>'],
      ['Questions to ask before choosing', '<ol><li>What is the problem I want help with—in one sentence?</li><li>Is there significant distress or clinical risk?</li><li>What qualification and scope does this practitioner hold?</li><li>What will sessions actually involve?</li><li>How will we know whether the support is helping?</li></ol>']
    ],
    faqs: [['Can an ADHD coach diagnose ADHD?','No. NICE states that ADHD diagnosis should be made by an appropriately qualified healthcare professional with relevant training and expertise.'],['Can I work with a coach and therapist at the same time?','Yes, when the roles are clear and the arrangement supports rather than fragments your care.'],['Is CBT the same as ADHD coaching?','No. CBT is a psychological therapy. A coach may use planning or reflection tools, but should not claim to deliver CBT without the relevant clinical qualification and scope.']],
    sources: [['NICE guideline NG87: recommendations','https://www.nice.org.uk/guidance/ng87/chapter/recommendations'],['NHS: ADHD in adults','https://www.nhs.uk/conditions/adhd-adults/'],['NHS: talking therapies','https://www.nhs.uk/service-search/mental-health/find-an-NHS-talking-therapies-service/']],
    ctaTitle: 'Choose support by need, not by label.', cta: 'If your need is practical structure, execution and recovery-aware accountability, ADHD coaching may be the right next conversation.', related: [['What ADHD coaching is','/blog/what-is-adhd-coaching'],['Nervous system regulation','/blog/nervous-system-regulation-exercises'],['ADHD coaching','/adhd-coaching']]
  },
  {
    slug: 'high-performance-without-burnout', theme: 'performance', tag: 'Performance coaching', eyebrow: 'Capacity · recovery · execution', read: '10 min read',
    title: 'High Performance Without Burnout | Abraham Spring',
    h1: 'High Performance Without Burnout: Build Capacity Before You Add Pressure',
    description: 'A recovery-led guide to sustainable high performance: manage demand, protect capacity, design better work and recognise when pressure has become harmful.',
    deck: 'High performance is not the ability to ignore every signal. It is the ability to produce excellent work repeatedly without making exhaustion the admission price.',
    image: 'high-performance-without-burnout-editorial.webp', alt: 'Abraham Spring hydrating during the Blenheim Palace Triathlon', destination: '/performance-coaching', nav: 'Performance coaching',
    answerTitle: 'The operating principle',
    answer: '<p>Sustainable high performance requires three things to stay connected: the demand you accept, the capacity you can genuinely access and the recovery that allows adaptation. When demand rises but capacity and recovery do not, performance may look impressive for a while—then become increasingly expensive.</p>',
    sections: [
      ['Stop confusing intensity with effectiveness', '<p>Intensity is a tool. It is not an identity. A high-pressure sprint can be appropriate around a defined deadline, just as a hard training block can be appropriate around a competition. The danger is allowing the exceptional phase to become the permanent operating model.</p><p>WHO describes burnout as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed. The word “chronic” matters. This is not one difficult day; it is a system that never completes the stress cycle.</p>'],
      ['Use a demand–capacity review', '<p>Once a week, list the demands that are fixed, negotiable and self-created. Then review capacity: sleep, health, emotional load, training, decision density and support. The objective is not to make the week easy. It is to stop planning as though capacity were constant.</p><ol><li>What must be excellent?</li><li>What only needs to be complete?</li><li>What can be delayed, delegated or declined?</li><li>Where is recovery explicitly scheduled?</li></ol>'],
      ['Design recovery into the work', '<p>Recovery is not only what happens on holiday. It includes closing loops, switching task type, reducing unnecessary decisions, using realistic meeting boundaries, eating regularly, protecting sleep and ending the working day with tomorrow already oriented.</p><p>HSE’s Management Standards focus on underlying work-design factors including demands, control, support, relationships, role and change. That is a useful correction to the idea that burnout is solved only by making the individual more resilient.</p>'],
      ['Measure repeatability, not heroics', '<p>A productive week followed by ten depleted days is not a high-performance system. Track whether output can be repeated, whether your error rate is changing, whether ordinary decisions feel disproportionately difficult and whether recovery restores you.</p><blockquote>The goal is not to remove pressure. It is to earn the right pressure with sufficient capacity and a credible route back.</blockquote>'],
      ['Know when coaching is not enough', '<p>Coaching can help with priorities, boundaries, workload architecture and behaviour change. It cannot diagnose or treat depression, anxiety, sleep disorders or other health conditions that can resemble or accompany burnout. If symptoms are severe, worsening or affecting daily life, speak with a GP or appropriate mental-health professional.</p>']
    ],
    faqs: [['Can you perform at a high level without stress?','Not without any stress. Short-term demand can support action and adaptation. The aim is flexible recovery and manageable chronic load, not permanent calm.'],['Is burnout a medical diagnosis?','WHO classifies burnout as an occupational phenomenon, not a medical condition. Similar symptoms can also relate to health or mental-health conditions, so appropriate assessment matters.'],['What does recovery-led performance mean?','It means planning output and pressure around real capacity, then treating recovery as part of performance design rather than a reward after depletion.']],
    sources: [['WHO: Burn-out as an occupational phenomenon','https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases'],['HSE: Management Standards for work-related stress','https://www.hse.gov.uk/stress/standards/overview.htm'],['NHS: Stress','https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/']],
    ctaTitle: 'Build a performance system you can repeat.', cta: 'Performance coaching connects ambition with capacity, recovery and a clearer operating rhythm—without lowering the standard that matters.', related: [['Performance coach role','/blog/what-does-a-performance-coach-do'],['Burnout recovery stages','/blog/burnout-recovery-stages'],['Performance coaching','/performance-coaching']]
  },
  {
    slug: 'what-does-a-performance-coach-do', theme: 'performance', tag: 'Performance coaching', eyebrow: 'Direction · decisions · delivery', read: '8 min read',
    title: 'What Does a Performance Coach Do? | Abraham Spring',
    h1: 'What Does a Performance Coach Do—and Is It Different From Life Coaching?',
    description: 'What performance coaching involves, what happens in sessions, how it differs from mentoring and therapy, and how to judge whether a coach is credible.',
    deck: 'A performance coach should not sell you a more impressive identity. The work is to make the gap between what matters and what repeatedly happens smaller.',
    image: 'performance-coach-editorial.webp', alt: 'Abraham Spring smiling and waving on the Blenheim Palace cycle course', destination: '/performance-coaching', nav: 'Performance coaching',
    answerTitle: 'What the role is',
    answer: '<p>A performance coach helps a person clarify outcomes, examine the patterns affecting delivery, design practical changes and review evidence from real life. The focus may include work, leadership, training, recovery and decision-making. Coaching is non-clinical and should not replace healthcare, therapy or specialist technical advice.</p>',
    sections: [
      ['A session should produce more than motivation', '<p>Good coaching may feel energising, but energy is not the deliverable. A session should improve the quality of a decision, expose a hidden constraint, create a testable action or make the next review more truthful.</p><p>The coach asks, challenges, reflects and helps structure the problem. They may share expertise when that is explicitly part of the arrangement, but should not disguise advice as a revelation you supposedly reached alone.</p>'],
      ['The four jobs of performance coaching', '<ol><li><strong>Direction:</strong> define what matters and what does not.</li><li><strong>Diagnosis of the pattern—not the person:</strong> locate friction in workload, environment, skill or recovery.</li><li><strong>Design:</strong> turn the insight into a practical operating change.</li><li><strong>Review:</strong> use evidence, not shame, to decide what to keep or adjust.</li></ol>'],
      ['Coaching, mentoring and therapy', '<p>A mentor usually brings experience in a specific path and may advise more directly. A consultant is typically hired to analyse and recommend. A therapist works within a qualified mental-health scope. A performance coach focuses on the client’s decisions, behaviour and systems.</p><p>These roles can overlap in style, but scope should remain explicit. If a coach cannot clearly explain what they do not do, that is useful information.</p>'],
      ['What recovery has to do with performance', '<p>Recovery determines which version of your capacity is available. A plan built for your best day will fail repeatedly on ordinary days. Recovery-led coaching therefore examines sleep, workload, training stress, boundaries and transitions alongside goals.</p><p>This is not lowering ambition. It is making execution less dependent on emergency levels of activation.</p>'],
      ['How to evaluate a coach', '<p>Ask for a clear explanation of process, scope, confidentiality, review points and fees. Be cautious around guaranteed outcomes, manufactured urgency, invented neuroscience and dependency framed as accountability.</p><blockquote>A credible coach should help you become more capable of running the system—not more afraid to function without the coach.</blockquote>']
    ],
    faqs: [['Who uses performance coaching?','Founders, leaders, athletes, creatives and professionals may use it when the challenge involves consistent execution, decisions, capacity or change.'],['Does a performance coach tell you what to do?','Sometimes expertise may be offered, but the core process should improve your own judgement and ownership rather than create dependency.'],['How quickly should coaching work?','There is no honest universal timeline. Agree what change would be observable and review the work at defined intervals.']],
    sources: [['HSE: work-related stress Management Standards','https://www.hse.gov.uk/stress/standards/overview.htm'],['WHO: mental health at work','https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work'],['NHS: Stress','https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/']],
    ctaTitle: 'Make the next decision cleaner.', cta: 'Performance coaching gives demanding work a clearer structure—connecting direction, delivery and recovery in the same conversation.', related: [['High performance without burnout','/blog/high-performance-without-burnout'],['Burnout coaching','/burnout-coaching'],['Performance coaching','/performance-coaching']]
  },
  {
    slug: 'what-is-strength-and-conditioning', theme: 'training', tag: 'Strength & conditioning', eyebrow: 'Adaptation · resilience · performance', read: '9 min read',
    title: 'What Is Strength and Conditioning? | Abraham Spring',
    h1: 'What Is Strength and Conditioning—and Who Is It Actually For?',
    description: 'Strength and conditioning explained: how training is assessed, programmed and progressed for performance, resilience and real-world physical capacity.',
    deck: 'Strength and conditioning is not a collection of hard exercises. It is the deliberate use of training, adaptation and recovery to prepare a person for a demand.',
    image: 'strength-conditioning-editorial.webp', alt: 'An athlete preparing for a strength session in a London gym', destination: '/strength-conditioning', nav: 'Strength & conditioning',
    answerTitle: 'A practical definition',
    answer: '<p>The UK Strength and Conditioning Association defines S&amp;C as the practical application of the science behind coaching, training adaptation and recovery. In practice, that means assessing the person and the demand, selecting appropriate training, progressing it over time and adjusting it according to response.</p>',
    sections: [
      ['It is more than lifting weights', '<p>Strength training is a major tool, but S&amp;C may also develop speed, power, aerobic capacity, movement skill, repeat-effort ability and tolerance for the forces of a sport or occupation. The programme should reflect the outcome—not the coach’s favourite exercise.</p><p>A runner, combat athlete, desk-bound founder and older adult may all benefit from S&amp;C, but their programmes should not look identical.</p>'],
      ['The basic process', '<ol><li><strong>Understand the demand:</strong> sport, work, health and life context.</li><li><strong>Establish a baseline:</strong> history, capacity, symptoms and relevant movement or performance measures.</li><li><strong>Prioritise:</strong> choose the few qualities that matter most now.</li><li><strong>Programme:</strong> set exercise, dose, frequency and progression.</li><li><strong>Review:</strong> adjust from performance, recovery and adherence—not ego.</li></ol>'],
      ['Why recovery belongs in the programme', '<p>Training is the stimulus; adaptation happens after it. Adding more work without sufficient recovery can reduce quality, obscure whether the plan is working and increase the cost of every session. Recovery is therefore part of programme design, not a separate wellness extra.</p>'],
      ['Is S&C only for athletes?', '<p>No. UKSCA notes that the whole population can benefit from strength and conditioning. UK physical-activity guidance also recommends that adults develop and maintain muscle strength at least twice a week.</p><p>The difference is specificity. General health training builds broad capacity. Athlete S&amp;C works backwards from competition demands, the training calendar and the athlete’s risk profile.</p>'],
      ['How a programme progresses', '<p>Progression can mean more load, but it can also mean better control, greater range, more speed at the same load, another high-quality repetition or the same work with less fatigue. The correct progression depends on the quality being trained.</p><p>A useful programme also includes periods where training holds steady or reduces. Adaptation is not linear, and constant escalation can turn a good plan into an avoidable recovery problem.</p>'],
      ['Strength, power and conditioning are different qualities', '<p>Strength is the ability to produce force. Power adds speed to that force. Conditioning prepares energy systems and repeated-effort capacity for a task. They interact, but they are not interchangeable. A long circuit can feel difficult without providing the strength or power stimulus the goal requires.</p><p>This is why exercise selection alone tells you very little. The dose, rest, intent and place in the wider programme determine what the exercise is doing.</p>'],
      ['What good coaching looks like', '<p>Expect clear reasons for the programme, technically appropriate coaching, progression you can tolerate and changes when the evidence says the plan needs to change. Hardness alone is not evidence of quality.</p><blockquote>The best programme is not the one that looks most advanced. It is the one that produces the right adaptation and can be repeated long enough to matter.</blockquote>']
    ],
    faqs: [['Is strength and conditioning the same as bodybuilding?','No. Bodybuilding prioritises muscular development and presentation. S&C selects methods according to a wider performance demand.'],['Do beginners need strength and conditioning?','Beginners can benefit greatly when training starts at an appropriate level and develops technique, confidence and capacity progressively.'],['How often should I do strength training?','UK guidance recommends muscle-strengthening activity at least twice a week for adults, but your specific dose should reflect your goals, history and total training load.']],
    sources: [['UKSCA: What is strength and conditioning?','https://www.uksca.org.uk/what-is-sandc'],['UK Chief Medical Officers’ physical activity guidelines','https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report'],['ACSM position stands','https://acsm.org/education-resources/pronouncements-scientific-communications/position-stands/']],
    ctaTitle: 'Train for the demand—not for the theatre.', cta: 'Strength and conditioning coaching turns your goal, movement history and recovery capacity into a programme with a reason behind every phase.', related: [['S&C vs personal training','/blog/strength-and-conditioning-vs-personal-training'],['Personal training','/personal-training'],['Strength & conditioning','/strength-conditioning']]
  },
  {
    slug: 'strength-and-conditioning-vs-personal-training', theme: 'training', tag: 'Coaching comparison', eyebrow: 'Goals · scope · right fit', read: '8 min read',
    title: 'Strength & Conditioning vs Personal Training | Abraham Spring',
    h1: 'Strength and Conditioning vs Personal Training: Which Coaching Do You Need?',
    description: 'Compare strength and conditioning with personal training by goal, assessment, programming and coaching style so you can choose the right support.',
    deck: 'The titles overlap. The useful difference is the problem being solved, the depth of programming and how closely training is tied to a specific performance demand.',
    image: 'strength-vs-personal-training-editorial.webp', alt: 'Abraham Spring riding hard during the Blenheim Palace Triathlon', destination: '/strength-conditioning', nav: 'Strength & conditioning',
    answerTitle: 'Choose by the outcome',
    answer: '<p>Personal training is often the better fit for general fitness, confidence, consistency and individual support. Strength and conditioning is usually more performance-led: it connects assessment, programming, adaptation and recovery to the demands of a sport or physically demanding goal. A coach may competently deliver both.</p>',
    sections: [
      ['Side-by-side', '<table class="comparison-table"><thead><tr><th>Personal training</th><th>Strength &amp; conditioning</th></tr></thead><tbody><tr><td>General fitness and individual goals</td><td>Performance qualities tied to a defined demand</td></tr><tr><td>Often session-led</td><td>Usually programme- and phase-led</td></tr><tr><td>Broad exercise support</td><td>Detailed management of adaptation, load and recovery</td></tr><tr><td>Suitable for beginners through experienced clients</td><td>Suitable for athletes and non-athletes with a specific performance need</td></tr></tbody></table>'],
      ['Choose personal training when', '<p>You want help becoming consistent, learning exercises, gaining confidence in a gym, improving general strength or building a routine around health and life. The individual attention and scheduled appointment may be the main value.</p>'],
      ['Choose S&C when', '<p>You need to prepare for a race, season, combat sport, demanding expedition or a measurable physical standard. You may also need S&amp;C when several training qualities must be balanced across a calendar rather than addressed one session at a time.</p>'],
      ['The coach matters more than the label', '<p>Neither title guarantees quality. Ask how the coach assesses your starting point, why the programme fits the goal, how progress is reviewed and how pain or health concerns are referred. Look at the process, not only the job title.</p>'],
      ['Assessment and progression', '<p>In either service, assessment should be proportionate to the goal. It may include training history, relevant health screening, movement observation, performance measures and a conversation about schedule and recovery. Testing should change a decision; it should not be theatre.</p><p>Progression should also be visible. That may mean improved technique, greater strength, more tolerance for sport-specific work or a routine you can finally maintain. If the coach cannot explain what is being progressed, the programme is difficult to evaluate.</p>'],
      ['Where rehabilitation fits', '<p>Neither personal training nor S&amp;C automatically qualifies someone to diagnose or treat injury. Coaches can work within a multidisciplinary plan and help rebuild physical capacity, but pain, neurological symptoms or a suspected injury may require assessment by an appropriately qualified healthcare professional.</p>'],
      ['What a hybrid approach looks like', '<p>Many people need both: the accessibility and relationship of personal training with the programme logic of S&amp;C. That might mean coached sessions for technique and effort, plus a wider plan that coordinates independent training, recovery and progression.</p><blockquote>You do not need the more impressive label. You need the level of structure your goal actually requires.</blockquote>']
    ],
    faqs: [['Is a strength coach better than a personal trainer?','Not inherently. The better fit depends on your goal, the practitioner’s competence and the quality of the process.'],['Can a personal trainer provide strength and conditioning?','Some can, if their education and experience match the performance demand. Ask how they assess, programme and review the work.'],['Which is right for a beginner?','Either can be appropriate. A beginner needs clear technique, suitable progression and a plan that builds confidence without unnecessary complexity.']],
    sources: [['UKSCA: What is strength and conditioning?','https://www.uksca.org.uk/what-is-sandc'],['UK Chief Medical Officers’ physical activity guidelines','https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report'],['CIMSPA professional standards','https://www.cimspa.co.uk/standards-home/']],
    ctaTitle: 'Choose the coaching depth your goal requires.', cta: 'Start with the demand. We can then decide whether personal training, strength and conditioning—or a hybrid structure—fits best.', related: [['What S&C is','/blog/what-is-strength-and-conditioning'],['Personal training','/personal-training'],['Strength & conditioning','/strength-conditioning']]
  },
  {
    slug: 'personal-training-cost-london', theme: 'training', tag: 'Personal training London', eyebrow: 'Price · value · fit', read: '8 min read',
    title: 'Personal Training Cost in London: A Clear Guide | Abraham Spring',
    h1: 'How Much Does Personal Training Cost in London—and What Are You Paying For?',
    description: 'A transparent guide to London personal-training costs, the factors that affect price, package questions to ask and how to judge value before you commit.',
    deck: 'A session price is easy to compare. Coaching quality is harder. The real question is what assessment, preparation, programming and follow-through sit behind the hour.',
    image: 'personal-training-cost-london-editorial.webp', alt: 'Abraham Spring climbing on the bike at Blenheim Palace', destination: '/personal-training', nav: 'Personal training',
    answerTitle: 'Why there is no single London price',
    answer: '<p>Personal-training prices vary according to location, coach experience, facility costs, session length, frequency and whether the service includes assessment, programme design and support between sessions. Ask for the complete cost and service before comparing. The lowest session fee is not always the lowest cost per useful outcome.</p>',
    sections: [
      ['The factors that change the price', '<ul><li><strong>Location:</strong> central studios and home visits usually carry higher overheads.</li><li><strong>Format:</strong> one-to-one, semi-private and online coaching have different economics.</li><li><strong>Scope:</strong> a coached hour is different from a programme with reviews and between-session support.</li><li><strong>Experience:</strong> specialist work may cost more when it genuinely requires deeper expertise.</li><li><strong>Commitment:</strong> packages may reduce the unit price but increase the upfront risk.</li></ul>'],
      ['What should be included', '<p>Before paying, establish whether the fee includes an initial consultation, relevant screening, programme design, session notes, progress reviews, independent-session guidance, cancellations and messaging support. If these are excluded, that may be entirely reasonable—the important thing is clarity.</p>'],
      ['How to compare value', '<p>Compare the service against your goal. If you need confidence and technique, close in-person coaching may be valuable. If you need a full training structure, the programme and review process may matter more than the number of supervised sessions.</p><p>Do not pay a premium for complexity you do not need. Equally, do not buy isolated sessions when your problem is the absence of a coherent plan.</p>'],
      ['Questions to ask a London PT', '<ol><li>What happens before the first training session?</li><li>Is programming included outside coached sessions?</li><li>Where exactly do sessions take place?</li><li>What is the cancellation and expiry policy?</li><li>How is progress reviewed?</li><li>What falls outside your professional scope?</li></ol>'],
      ['Red flags', '<p>Be cautious around guaranteed body transformations, pressure to buy before a consultation, unclear package expiry, generic programmes presented as bespoke, and health claims beyond the trainer’s scope.</p><blockquote>Good value is not the most punishment per pound. It is the right level of expertise, attention and structure for the outcome you need.</blockquote>']
    ],
    faqs: [['Are personal-training packages cheaper?','They may reduce the per-session price, but check the total commitment, expiry and refund terms before deciding.'],['Is online personal training cheaper than in person?','Often, but formats vary. Compare the programme, contact, reviews and technique support—not only the delivery channel.'],['Should a consultation be free?','There is no universal rule. What matters is that you know whether it is exploratory, an assessment, or part of the paid coaching process.']],
    sources: [['CIMSPA professional standards','https://www.cimspa.co.uk/standards-home/'],['UK Chief Medical Officers’ physical activity guidelines','https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report'],['Citizens Advice: service contracts and consumer rights','https://www.citizensadvice.org.uk/consumer/']],
    ctaTitle: 'Compare the coaching, not only the hour.', cta: 'Explore a recovery-led personal-training approach built around your goal, training history and the support you will actually use.', related: [['Online personal training','/blog/how-online-personal-training-works'],['S&C vs PT','/blog/strength-and-conditioning-vs-personal-training'],['Personal training','/personal-training']]
  },
  {
    slug: 'how-online-personal-training-works', theme: 'training', tag: 'Online personal training', eyebrow: 'Programme · feedback · autonomy', read: '8 min read',
    title: 'How Does Online Personal Training Work? | Abraham Spring',
    h1: 'How Does Online Personal Training Work—and Who Is It Best For?',
    description: 'How online personal training works from assessment to programming, video feedback and reviews, plus the questions to ask before choosing a coach.',
    deck: 'Online coaching is not a PDF sent once a month. At its best, it is a living programme, a clear feedback loop and enough support to make independent training work.',
    image: 'online-personal-training-editorial.webp', alt: 'An athlete preparing to train in a London gym', destination: '/personal-training', nav: 'Personal training',
    answerTitle: 'The basic model',
    answer: '<p>Online personal training typically combines an initial consultation, a programme delivered digitally, exercise guidance, regular check-ins and adjustments based on feedback. Some services add live video sessions or technique review. The quality depends on the assessment and feedback loop—not the app used to deliver it.</p>',
    sections: [
      ['Step 1: establish the starting point', '<p>A coach should understand your goal, training history, available equipment, schedule, confidence, injuries or symptoms requiring referral, and the amount of training you can recover from. A generic questionnaire can collect facts; a conversation often reveals the constraints.</p>'],
      ['Step 2: build the programme', '<p>The programme should tell you what to do, how much, how hard and what to do when the planned session does not fit the day. Exercise videos can support understanding, but they do not replace reasoning. You should know why the phase exists and what progress looks like.</p>'],
      ['Step 3: create a useful feedback loop', '<p>Useful feedback includes completed work, perceived effort, symptoms, technique video where appropriate, sleep or recovery context and practical barriers. The coach then decides whether to progress, hold, regress or redesign.</p><p>More data is not always better. Collect the minimum that changes a coaching decision.</p>'],
      ['Who online coaching suits', '<p>It often suits people who can train independently but need a better plan, expert review and consistent structure. It can work well for travel, irregular schedules and access to specialist coaching outside your area.</p><p>It may be a poor fit when you require close physical assistance, immediate supervision for safety, or do not yet feel confident performing foundational movements alone.</p>'],
      ['What to ask before joining', '<ol><li>How often is the programme reviewed?</li><li>How quickly is technique feedback provided?</li><li>Are check-ins live, written or automated?</li><li>What happens if pain or illness appears?</li><li>Can the programme adapt to travel or limited equipment?</li><li>How is your data handled?</li></ol><blockquote>The platform delivers the coaching. It is not the coaching.</blockquote>']
    ],
    faqs: [['Do I need a gym for online personal training?','No. A programme can be built around home, outdoor or gym equipment, provided the coach knows what is realistically available.'],['Can an online coach check technique?','Many use video review or live calls. Ask how feedback works and which movements are appropriate to perform remotely.'],['Is online coaching personalised?','It can be, but personalisation should show up in exercise choice, dose, progression and adaptation—not only your name at the top of a template.']],
    sources: [['UK Chief Medical Officers’ physical activity guidelines','https://www.gov.uk/government/publications/physical-activity-guidelines-uk-chief-medical-officers-report'],['CIMSPA professional standards','https://www.cimspa.co.uk/standards-home/'],['ICO: protecting personal information','https://ico.org.uk/for-the-public/']],
    ctaTitle: 'Train independently without planning alone.', cta: 'Online personal training combines a clear programme with human review, recovery-aware adjustments and support that travels with you.', related: [['London PT costs','/blog/personal-training-cost-london'],['What S&C is','/blog/what-is-strength-and-conditioning'],['Personal training','/personal-training']]
  },
  {
    slug: 'am-i-burnt-out', theme: 'burnout', tag: 'Burnout', eyebrow: 'Signs · context · next steps', read: '10 min read',
    title: 'Am I Burnt Out? Signs, Context and Next Steps | Abraham Spring',
    h1: 'Am I Burnt Out—or Just Tired? Signs, Context and What to Do Next',
    description: 'A grounded guide to burnout signs, how burnout differs from ordinary tiredness, what else symptoms may mean and practical next steps for support.',
    deck: 'One exhausted week does not define you. But when rest stops restoring you, distance from work grows and your sense of effectiveness shrinks, the pattern deserves attention.',
    image: 'am-i-burnt-out-editorial.webp', alt: 'Abraham Spring running with support during the Blenheim Palace Triathlon', destination: '/burnout-coaching', nav: 'Burnout coaching',
    answerTitle: 'The pattern to notice',
    answer: '<p>WHO describes burnout through three occupational dimensions: exhaustion, increasing mental distance or cynicism towards work, and reduced professional efficacy. It is not classified as a medical condition. If symptoms are significant, persistent or worsening, seek appropriate healthcare support because other physical and mental-health conditions can look similar.</p>',
    sections: [
      ['Tiredness usually responds to recovery', '<p>Ordinary tiredness follows demand and tends to improve with adequate sleep, food, reduced load or time away. Burnout is more persistent and changes the relationship with work. You may rest without feeling restored, become detached from work you once cared about, or feel less capable despite continuing to push.</p>'],
      ['Common signs people notice', '<ul><li>Energy depletion that is not resolving as expected.</li><li>Cynicism, irritability or emotional distance around work.</li><li>Reduced concentration, confidence or sense of effectiveness.</li><li>Difficulty switching off even when work has stopped.</li><li>Sleep disruption, headaches, muscle tension or changes in appetite.</li><li>Using more caffeine, alcohol, food or training intensity to manage state.</li></ul><p>These signs are not a self-diagnosis. They are information that the current arrangement may be harming you.</p>'],
      ['Look at the work design, not only the individual', '<p>HSE identifies six areas of work design associated with stress when poorly managed: demands, control, support, relationships, role and change. Review each one. A breathing practice may help tonight; it cannot resolve unclear authority, impossible workload or sustained workplace conflict on its own.</p>'],
      ['What to do this week', '<ol><li>Write down the symptoms and when they occur.</li><li>Reduce one non-essential demand rather than adding a perfect recovery routine.</li><li>Tell someone you trust what is happening.</li><li>Discuss work-related causes and possible adjustments where safe.</li><li>Book appropriate professional support if the pattern is affecting daily life.</li></ol>'],
      ['When to seek clinical help', '<p>Speak with a GP if symptoms persist, worsen or interfere with daily functioning, or if you are unsure whether another condition may be involved. Seek urgent help if you feel unable to keep yourself safe. Coaching is not crisis care and should not become a delay to appropriate treatment.</p><blockquote>Burnout is not proof that you cared too much. It is evidence that demand, conditions and recovery have stopped balancing.</blockquote>']
    ],
    faqs: [['Can a weekend fix burnout?','A break may offer relief, but persistent burnout usually requires changes to the conditions producing the load as well as recovery.'],['Is burnout the same as depression?','No. They can share features, and a person may experience both. A qualified healthcare professional should assess significant or persistent symptoms.'],['Can coaching help with burnout?','Coaching may help with workload, boundaries, recovery and return-to-performance planning. It does not diagnose or treat medical or mental-health conditions.']],
    sources: [['WHO: Burn-out as an occupational phenomenon','https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases'],['HSE: Management Standards','https://www.hse.gov.uk/stress/standards/overview.htm'],['NHS: Stress','https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/']],
    ctaTitle: 'Do not turn recovery into another performance test.', cta: 'Burnout coaching can help you reduce avoidable load, rebuild boundaries and plan a safer return to demanding work alongside appropriate clinical support.', related: [['Burnout recovery stages','/blog/burnout-recovery-stages'],['High performance without burnout','/blog/high-performance-without-burnout'],['Burnout coaching','/burnout-coaching']]
  },
  {
    slug: 'nervous-system-dysregulation-signs', theme: 'nervous-system', tag: 'Nervous system', eyebrow: 'State · patterns · support', read: '9 min read',
    title: 'Nervous System Dysregulation Signs: A Grounded Guide',
    h1: 'Signs of Nervous System Dysregulation—and What They Can and Cannot Tell You',
    description: 'A grounded guide to nervous-system dysregulation signs, common activation and shutdown patterns, practical tracking and when to seek clinical help.',
    deck: '“Dysregulated” is often used as though it were a diagnosis. It is more useful as plain language for a pattern: your state does not shift with the flexibility the situation needs.',
    image: 'nervous-system-dysregulation-editorial.webp', alt: 'A focused close portrait of Abraham Spring before training', destination: '/nervous-system', nav: 'Nervous system coaching',
    answerTitle: 'What people usually mean',
    answer: '<p>Nervous-system dysregulation is not a single formal diagnosis. People often use the phrase to describe persistent over-activation, under-activation or rapid movement between the two. Signs can include restlessness, tension, racing thoughts, numbness, fatigue, shutdown or difficulty recovering after stress—but these experiences can have many causes.</p>',
    sections: [
      ['Activation signs', '<p>When mobilisation stays high, you may notice shallow or fast breathing, a clenched jaw, scanning for problems, irritability, difficulty sitting still, racing thoughts, sleep disruption or an urge to solve everything immediately.</p><p>Activation is not inherently bad. It helps you act. The question is whether the response fits the situation and whether you can come down afterwards.</p>'],
      ['Shutdown or under-activation signs', '<p>Some people experience heaviness, fog, low motivation, emotional distance, slowed decision-making or a sense of being unable to begin. It can be tempting to interpret this as laziness. It may instead signal overload, depletion or another health concern that deserves assessment.</p>'],
      ['Why a symptom list is not a diagnosis', '<p>Palpitations, dizziness, fatigue, sleep change and concentration problems can relate to stress, anxiety, medication, illness, hormonal changes, cardiovascular issues and many other causes. Do not use a social-media checklist to rule those possibilities in or out.</p><div class="scope-box"><h2>Use appropriate care</h2><p>Speak with a GP or qualified health professional about new, severe, persistent or concerning symptoms. Call emergency services for urgent or life-threatening symptoms.</p></div>'],
      ['Track patterns without obsessing', '<p>For seven days, record the situation, body sensations, behaviour, sleep context and what helped the state shift. Keep it brief. You are looking for patterns—meetings without breaks, under-fuelling, late-night work, conflict, excessive training—not a perfect score.</p>'],
      ['What regulation work can do', '<p>Gentle breathing, grounding, rhythmic movement, clearer transitions and environmental changes may help create a state shift. Longer-term work often involves sleep, workload, relationships, healthcare, psychological support and reducing the source of repeated threat.</p><blockquote>A regulation tool can change the next five minutes. A regulation system changes what keeps producing the same five minutes.</blockquote>']
    ],
    faqs: [['Is nervous-system dysregulation a diagnosis?','Not as a single general diagnosis. It is commonly used descriptive language, so specific symptoms and causes still need appropriate assessment.'],['Can HRV prove I am dysregulated?','No. HRV can provide context when measured consistently, but it is influenced by many factors and does not diagnose your psychological or medical state.'],['Can coaching regulate my nervous system?','Coaching can support awareness, routines, workload and non-clinical practices. It cannot diagnose or treat neurological, autonomic or mental-health conditions.']],
    sources: [['NHS: Stress','https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/'],['NHS: Breathing exercises for stress','https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/'],['NHS 111: Get help for your symptoms','https://111.nhs.uk/']],
    ctaTitle: 'Read the pattern. Then change the conditions.', cta: 'Nervous system coaching helps connect state-change practices with workload, training, sleep and the structure of your week.', related: [['Regulation exercises','/blog/nervous-system-regulation-exercises'],['Burnout signs','/blog/am-i-burnt-out'],['Nervous system coaching','/nervous-system']]
  }
];

function json(value) { return JSON.stringify(value).replace(/</g, '\\u003c'); }

function render(a) {
  const canonical = `https://abrahamspring.co.uk/blog/${a.slug}`;
  const imageUrl = `https://abrahamspring.co.uk/assets/blog/${a.image}`;
  const faqSchema = a.faqs.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } }));
  const graph = [
    { '@type': 'BlogPosting', headline: a.h1, description: a.description, datePublished: isoDate, dateModified: isoDate, image: imageUrl, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }, author: { '@id': 'https://abrahamspring.co.uk/#person' }, publisher: { '@id': 'https://abrahamspring.co.uk/#practice' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abrahamspring.co.uk/' }, { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://abrahamspring.co.uk/blog/' }, { '@type': 'ListItem', position: 3, name: a.h1, item: canonical }] },
    { '@type': 'FAQPage', mainEntity: faqSchema }
  ];
  const sectionHtml = a.sections.map(([heading, body]) => `<h2>${heading}</h2>\n${body}`).join('\n\n');
  const faqHtml = a.faqs.map(([q, answer]) => `<div class="faq-item"><h3>${q}</h3><p>${answer}</p></div>`).join('');
  const sourceHtml = a.sources.map(([label, url]) => `<li><a href="${url}" rel="noopener">${label}</a>.</li>`).join('');
  const relatedHtml = a.related.map(([label, url]) => `<a href="${url}"><span>Continue</span>${label}</a>`).join('');
  const encoded = encodeURIComponent(canonical);
  const emailSubject = encodeURIComponent(a.h1);
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-G8VF61J7PK"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G8VF61J7PK');</script>
  <title>${a.title}</title><meta name="description" content="${a.description}"><meta name="author" content="Abraham Spring"><link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article"><meta property="og:site_name" content="Abraham Spring"><meta property="og:locale" content="en_GB"><meta property="og:title" content="${a.h1}"><meta property="og:description" content="${a.description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${a.h1}"><meta name="twitter:description" content="${a.description}"><meta name="twitter:image" content="${imageUrl}">
  <meta name="robots" content="index, follow"><meta name="theme-color" content="#1D1D1F"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="manifest" href="/manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500;700&amp;display=swap"><link rel="stylesheet" href="/blog/article.css?v=20260830-3">
  <script type="application/ld+json">${json({ '@context': 'https://schema.org', '@graph': graph })}</script>
</head>
<body class="editorial-page" data-theme="${a.theme}">
  <nav class="article-nav" aria-label="Article navigation"><a href="/" class="article-brand"><span class="brand-mark">AS</span><span class="brand-name">Abraham Spring</span></a><div class="article-nav-links"><a href="/performance-coaching">Coaching</a><a href="/blog/">Insights</a><a href="${a.destination}" class="nav-cta">${a.nav}</a></div></nav>
  <main id="main" class="article">
    <div class="article-tag">${a.tag}</div><div class="eyebrow">${a.eyebrow}</div><h1>${a.h1}</h1><p class="article-deck">${a.deck}</p>
    <div class="article-meta"><span>By Abraham Spring</span><span>Reviewed ${reviewed}</span><span>${a.read}</span></div>
    <img class="hero-img" src="/assets/blog/${a.image}" alt="${a.alt}" width="1122" height="1402" fetchpriority="high">
    <article class="article-body">
      <div class="answer-box"><h2>${a.answerTitle}</h2>${a.answer}</div>
      ${sectionHtml}
      <h2>Frequently asked questions</h2><div class="faq-list">${faqHtml}</div>
      <div class="source-box"><h2>Sources</h2><ol>${sourceHtml}</ol></div>
    </article>
    <div class="article-after">
      <div class="article-cta"><h2>${a.ctaTitle}</h2><p>${a.cta}</p><a href="${a.destination}">Explore ${a.nav.toLowerCase()} &rsaquo;</a></div>
      <div class="author-card"><div class="author-mark">AS</div><div><strong>Written by Abraham Spring</strong><p>Recovery-led performance coach, founder of The Unbroken Protocol and creator of the R.A.C.E. Framework.</p></div></div>
      <div class="share-row"><span class="share-label">Share this</span><a class="share-btn" href="https://x.com/intent/post?url=${encoded}" target="_blank" rel="noopener" aria-label="Share on X">X</a><a class="share-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encoded}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">in</a><a class="share-btn" href="mailto:?subject=${emailSubject}&amp;body=${encoded}" aria-label="Share by email">Email</a></div>
      <div class="related"><h2>Continue the work</h2><div class="related-grid">${relatedHtml}</div></div>
    </div>
  </main>
  <footer class="article-footer">&copy; 2026 Abraham Spring · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
</body>
</html>\n`;
}

for (const article of articles) {
  await writeFile(path.join(root, 'blog', `${article.slug}.html`), render(article));
}

const indexCards = [
  ...articles,
  { slug: 'burnout-recovery-stages', tag: 'Burnout recovery', h1: 'Burnout Recovery Stages: What Changes First—and What Takes Longer', deck: 'A practical five-phase map for reducing load, rebuilding capacity and returning without recreating the same pattern.', image: 'burnout-recovery-editorial.webp', read: '10 min read' },
  { slug: 'nervous-system-regulation-exercises', tag: 'Nervous system', h1: 'Nervous System Regulation Exercises That Do Not Turn Recovery Into Work', deck: 'Five practical exercises, a five-minute starting routine and a clear account of what regulation cannot promise.', image: 'nervous-system-regulation-editorial.webp', read: '8 min read' }
];

const cards = indexCards.map((a, index) => `<a href="/blog/${a.slug}" class="insight-card${index === 0 ? ' featured' : ''}">
  <img src="/assets/blog/${a.image}" alt="" width="1122" height="1402" loading="${index < 2 ? 'eager' : 'lazy'}">
  <div class="card-copy"><span>${a.tag}</span><h2>${a.h1}</h2><p>${a.deck}</p><small>30 August 2026 · ${a.read}</small></div>
</a>`).join('\n');

const blogIndex = `<!DOCTYPE html>
<html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-G8VF61J7PK"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-G8VF61J7PK');</script>
<title>Insights on Performance, Burnout & ADHD | Abraham Spring</title><meta name="description" content="Evidence-led articles from Abraham Spring on burnout recovery, nervous system regulation, ADHD coaching, performance and strength coaching."><link rel="canonical" href="https://abrahamspring.co.uk/blog/"><meta name="robots" content="index, follow">
<meta property="og:type" content="website"><meta property="og:title" content="Insights | Abraham Spring"><meta property="og:description" content="Recovery-led thinking for demanding lives."><meta property="og:url" content="https://abrahamspring.co.uk/blog/"><meta property="og:image" content="https://abrahamspring.co.uk/assets/blog/high-performance-without-burnout-editorial.webp">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=DM+Serif+Display&amp;display=swap">
<style>
*{box-sizing:border-box}body{margin:0;background:#f7f6f2;color:#1d1d1f;font-family:Inter,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit}.nav{height:74px;padding:0 max(24px,5vw);display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(29,29,31,.12);background:rgba(247,246,242,.9);position:sticky;top:0;z-index:5;backdrop-filter:blur(16px)}.brand{text-decoration:none;font-weight:800;display:flex;gap:10px;align-items:center}.mark{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#1d1d1f;color:#fff;font-size:12px}.nav div{display:flex;gap:24px;align-items:center}.nav div a{text-decoration:none;font-size:14px;font-weight:600}.cta{background:#8a4b14;color:#fff!important;padding:11px 18px;border-radius:999px}.hero{max-width:1180px;margin:auto;padding:96px 28px 56px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:700;color:#8a4b14}.hero h1{font:400 clamp(48px,8vw,92px)/.94 'DM Serif Display',Georgia,serif;letter-spacing:-.045em;max-width:900px;margin:18px 0 24px}.hero p{font-size:clamp(18px,2vw,23px);line-height:1.55;color:#505054;max-width:720px}.grid{max-width:1180px;margin:auto;padding:0 28px 110px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.insight-card{background:#fff;border:1px solid rgba(29,29,31,.12);border-radius:24px;overflow:hidden;text-decoration:none;display:grid;grid-template-columns:42% 58%;min-height:330px;transition:transform .25s,box-shadow .25s}.insight-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(29,29,31,.1)}.insight-card img{width:100%;height:100%;object-fit:cover}.card-copy{padding:30px;display:flex;flex-direction:column}.card-copy span{text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:800;color:#8a4b14}.card-copy h2{font:400 29px/1.08 'DM Serif Display',Georgia,serif;letter-spacing:-.025em;margin:13px 0}.card-copy p{color:#505054;font-size:14px;line-height:1.6;margin:0 0 20px}.card-copy small{color:#626268;margin-top:auto}.featured{grid-column:1/-1;grid-template-columns:48% 52%;min-height:520px}.featured .card-copy{padding:52px}.featured .card-copy h2{font-size:clamp(38px,4vw,58px)}.featured .card-copy p{font-size:17px}.footer{padding:30px;text-align:center;border-top:1px solid rgba(29,29,31,.12);color:#626268;font-size:13px}@media(max-width:820px){.nav div>a:not(.cta){display:none}.hero{padding-top:68px}.grid{grid-template-columns:1fr}.insight-card,.featured{grid-column:auto;grid-template-columns:1fr;min-height:0}.insight-card img{height:280px}.featured .card-copy,.card-copy{padding:28px}.featured .card-copy h2,.card-copy h2{font-size:30px}}
</style><script type="application/ld+json">${json({ '@context': 'https://schema.org', '@type': 'Blog', name: 'Insights | Abraham Spring', url: 'https://abrahamspring.co.uk/blog/', author: { '@id': 'https://abrahamspring.co.uk/#person' }, blogPost: indexCards.map(a => ({ '@type': 'BlogPosting', headline: a.h1, url: `https://abrahamspring.co.uk/blog/${a.slug}` })) })}</script></head>
<body><nav class="nav"><a class="brand" href="/"><span class="mark">AS</span>Abraham Spring</a><div><a href="/performance-coaching">Coaching</a><a href="/blog/">Insights</a><a class="cta" href="/#apply-form">Book a conversation</a></div></nav>
<header class="hero"><div class="eyebrow">The field notes</div><h1>Recovery-led thinking for demanding lives.</h1><p>Evidence-led guides on burnout, ADHD, nervous-system regulation, performance and physical capacity—written to help you make a better next decision.</p></header>
<main class="grid">${cards}</main><footer class="footer">&copy; 2026 Abraham Spring · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer></body></html>\n`;
await writeFile(path.join(root, 'blog', 'index.html'), blogIndex);

const territoryBySlug = {
  'what-is-adhd-coaching': ['ADHD coaching','what is ADHD coaching','informational','/adhd-coaching'],
  'adhd-coaching-vs-therapy': ['ADHD coaching','ADHD coaching vs therapy','comparison','/adhd-coaching'],
  'high-performance-without-burnout': ['Performance coaching','high performance without burnout','informational-commercial','/performance-coaching'],
  'what-does-a-performance-coach-do': ['Performance coaching','what does a performance coach do','informational-commercial','/performance-coaching'],
  'what-is-strength-and-conditioning': ['Strength and conditioning','what is strength and conditioning','informational','/strength-conditioning'],
  'strength-and-conditioning-vs-personal-training': ['Strength and conditioning','strength and conditioning vs personal training','comparison','/strength-conditioning'],
  'personal-training-cost-london': ['Personal training','personal training cost London','commercial-investigation','/personal-training'],
  'how-online-personal-training-works': ['Personal training','how does online personal training work','informational-commercial','/personal-training'],
  'am-i-burnt-out': ['Burnout coaching','am I burnt out','informational','/burnout-coaching'],
  'nervous-system-dysregulation-signs': ['Nervous system coaching','signs of nervous system dysregulation','informational','/nervous-system']
};
const ownershipPath = path.join(root, 'seo', 'ownership.json');
const ownership = JSON.parse(await readFile(ownershipPath, 'utf8'));
ownership.measurement.trackedKeywords = 42;
ownership.measurement.authorityArticleKeywords = 22;
ownership.measurement.latestKeywordExpansion = '20 strict UK article keywords added in SE Ranking on 2026-08-30';
for (const a of articles) {
  const [territory, primaryKeyword, intent, commercialDestination] = territoryBySlug[a.slug];
  const row = { territory, slug: a.slug, workingTitle: a.h1, primaryKeyword, intent, commercialDestination, evidenceRequirement: 'Authoritative public-health, professional-body or primary sources; maintain explicit coaching scope.', status: 'implemented' };
  const index = ownership.articleBacklog.findIndex(item => item.slug === a.slug);
  if (index >= 0) ownership.articleBacklog[index] = { ...ownership.articleBacklog[index], ...row };
  else ownership.articleBacklog.push(row);
}
ownership.updated = isoDate;
await writeFile(ownershipPath, `${JSON.stringify(ownership, null, 2)}\n`);

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
const sitemapRows = articles.filter(a => !sitemap.includes(`<loc>https://abrahamspring.co.uk/blog/${a.slug}</loc>`)).map(a => `  <url>\n    <loc>https://abrahamspring.co.uk/blog/${a.slug}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
if (sitemapRows) sitemap = sitemap.replace('</urlset>', `${sitemapRows}\n</urlset>`);
await writeFile(sitemapPath, sitemap);

const llmsPath = path.join(root, 'llms.txt');
let llms = await readFile(llmsPath, 'utf8');
const llmRows = articles.filter(a => !llms.includes(`/blog/${a.slug}`)).map(a => `- [${a.h1}](https://abrahamspring.co.uk/blog/${a.slug}): ${a.description}`).join('\n');
if (llmRows) llms = llms.replace('## Optional', `${llmRows}\n\n## Optional`);
await writeFile(llmsPath, llms);

console.log(`Generated ${articles.length} editorial articles, the insight index, ownership map, sitemap and llms.txt.`);
