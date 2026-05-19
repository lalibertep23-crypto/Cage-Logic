-- ============================================================================
-- CAGESIDE V1 — TECHNIQUE TAGS SEED
-- Source: docs/grok-origin-chat.md (position pathways, standup DNA, finishing).
-- Tuned for Iron Army (Frankie Edgar wrestling emphasis preserved).
-- Run once after schema migration. Idempotent via slug uniqueness.
-- ============================================================================

insert into public.technique_tags (slug, label, discipline, category, position) values
-- ---------- GUARD (closed/open) ----------
('scissor-sweep',          'Scissor sweep',                 'bjj', 'sweep',              'closed_guard'),
('hip-bump-sweep',          'Hip bump sweep',                'bjj', 'sweep',              'closed_guard'),
('flower-sweep',            'Flower sweep',                  'bjj', 'sweep',              'closed_guard'),
('pendulum-sweep',          'Pendulum sweep',                'bjj', 'sweep',              'closed_guard'),
('triangle-from-guard',     'Triangle from guard',           'bjj', 'submission',         'closed_guard'),
('armbar-from-guard',       'Armbar from guard',             'bjj', 'submission',         'closed_guard'),
('kimura-from-guard',       'Kimura from guard',             'bjj', 'submission',         'closed_guard'),
('omoplata',                'Omoplata',                      'bjj', 'submission',         'closed_guard'),
('guillotine-from-guard',   'Guillotine from guard',         'bjj', 'submission',         'closed_guard'),
('guard-pull',              'Guard pull',                    'bjj', 'transition',         'standup'),

-- ---------- GUARD RETENTION / OPEN GUARD ----------
('shrimp-escape',           'Shrimp escape (hip escape)',    'bjj', 'drill',              'open_guard'),
('guard-retention-flow',    'Guard retention flow',          'bjj', 'drill',              'open_guard'),
('butterfly-sweep',         'Butterfly sweep',               'bjj', 'sweep',              'open_guard'),
('butterfly-guard-frame',   'Butterfly guard framing',       'bjj', 'positional_control', 'open_guard'),
('de-la-riva-guard',        'De la Riva guard',              'bjj', 'positional_control', 'open_guard'),
('spider-guard',            'Spider guard',                  'bjj', 'positional_control', 'open_guard'),
('x-guard-entry',           'X-guard entry',                 'bjj', 'transition',         'open_guard'),

-- ---------- HALF GUARD ----------
('half-guard-frame',        'Half guard framing',            'bjj', 'positional_control', 'half_guard'),
('underhook-sweep',         'Underhook sweep (half guard)',  'bjj', 'sweep',              'half_guard'),
('kimura-from-half',        'Kimura from half guard',        'bjj', 'submission',         'half_guard'),
('half-guard-pass-flatten', 'Flatten and pass half guard',   'bjj', 'pass',               'half_guard'),

-- ---------- SIDE CONTROL (top) ----------
('knee-cut-pass',           'Knee cut pass',                 'bjj', 'pass',               'side_control'),
('paper-cutter-choke',      'Paper cutter choke',            'bjj', 'submission',         'side_control'),
('side-control-hold',       'Side control hold (30s)',       'bjj', 'drill',              'side_control'),
('americana-from-side',     'Americana from side',           'bjj', 'submission',         'side_control'),
('north-south-choke',       'North-south choke',             'bjj', 'submission',         'side_control'),
('mount-from-side',         'Mount from side control',       'bjj', 'transition',         'side_control'),

-- ---------- SIDE CONTROL (bottom) ----------
('knee-in-escape',          'Knee-in escape',                'bjj', 'escape',             'side_control'),
('ghost-escape',            'Ghost escape (elbow to hip)',   'bjj', 'escape',             'side_control'),
('recover-guard-from-side', 'Recover guard from side',       'bjj', 'escape',             'side_control'),

-- ---------- MOUNT (top) ----------
('mount-maintenance',       'Mount maintenance',             'bjj', 'drill',              'mount'),
('armbar-from-mount',       'Armbar from mount',             'bjj', 'submission',         'mount'),
('americana-from-mount',    'Americana from mount',          'bjj', 'submission',         'mount'),
('ezekiel-choke',           'Ezekiel choke',                 'bjj', 'submission',         'mount'),
('cross-collar-choke',      'Cross-collar choke (gi)',       'bjj', 'submission',         'mount'),
('s-mount-armbar',          'S-mount armbar',                'bjj', 'submission',         'mount'),

-- ---------- MOUNT (bottom) ----------
('upa-bridge-escape',       'Upa (bridge & roll) escape',    'bjj', 'escape',             'mount'),
('elbow-knee-escape',       'Elbow-knee escape',             'bjj', 'escape',             'mount'),
('technical-standup',       'Technical stand-up',            'bjj', 'escape',             'mount'),

-- ---------- BACK ----------
('rear-naked-choke',        'Rear naked choke',              'bjj', 'submission',         'back'),
('body-triangle-setup',     'Body triangle setup',           'bjj', 'positional_control', 'back'),
('hook-fighting',           'Hook fighting (1 min)',         'bjj', 'drill',              'back'),
('chair-sit-back-take',     'Chair sit back take',           'bjj', 'transition',         'back'),
('back-escape-shoulder',    'Back escape (shoulder pin)',    'bjj', 'escape',             'back'),
('bow-and-arrow-choke',     'Bow and arrow choke (gi)',      'bjj', 'submission',         'back'),

-- ---------- TURTLE ----------
('turtle-recovery',         'Turtle recovery to guard',      'bjj', 'escape',             'turtle'),
('underhook-back-take',     'Underhook back take from turtle','bjj', 'transition',        'turtle'),

-- ---------- STANDUP (Iron Army / Frankie wrestling DNA) ----------
('double-leg-takedown',     'Double-leg takedown',           'wrestling', 'takedown',     'standup'),
('single-leg-takedown',     'Single-leg takedown',           'wrestling', 'takedown',     'standup'),
('high-crotch',             'High crotch',                   'wrestling', 'takedown',     'standup'),
('arm-drag-back-take',      'Arm drag to back take',         'wrestling', 'takedown',     'standup'),
('sprawl',                  'Sprawl',                        'wrestling', 'escape',       'standup'),
('pummeling-underhook',     'Pummeling / underhook battle',  'wrestling', 'drill',        'standup'),
('shadow-wrestling',        'Shadow wrestling',              'wrestling', 'drill',        'standup'),
('snap-down',               'Snap down to front headlock',   'wrestling', 'takedown',     'standup'),
('ankle-pick',              'Ankle pick',                    'wrestling', 'takedown',     'standup'),
('foot-sweep',              'Foot sweep (judo)',             'bjj', 'takedown',           'standup'),
('takedown-to-pass-chain',  'Takedown → immediate pass',     'bjj', 'drill',              'standup'),

-- ---------- NECK / GUILLOTINE FAMILY ----------
('guillotine-standing',     'Guillotine (standing)',         'bjj', 'submission',         'standup'),
('darce-choke',             'Darce choke',                   'bjj', 'submission',         null),
('anaconda-choke',           'Anaconda choke',                'bjj', 'submission',         null),

-- ---------- LEG LOCKS (intro) ----------
('straight-ankle-lock',     'Straight ankle lock',           'bjj', 'submission',         null),
('heel-hook-defense',       'Heel hook defense',             'bjj', 'escape',             null),

-- ---------- DRILLS / GENERAL ----------
('positional-sparring',     'Positional sparring',           'bjj', 'drill',              null),
('flow-rolling',            'Flow rolling',                  'bjj', 'drill',              null),
('submission-flow-roll',    'Submission flow rolling',       'bjj', 'drill',              null),
('takedown-to-sub-chain',   'Takedown → submission chain',   'bjj', 'drill',              'standup'),
('grip-strength-towel',     'Grip strength: towel pulls',    'bjj', 'drill',              null),
('grip-strength-fat-grips', 'Grip strength: fat grips',      'bjj', 'drill',              null),
('warmup-movement-flow',    'Warm-up movement flow',         'bjj', 'drill',              null),
('breakfalls',              'Breakfalls',                    'bjj', 'drill',              null)
on conflict (slug) do nothing;
