import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    StatusBar,
    Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

interface ScaleQuestionnaireModalProps {
    visible: boolean;
    onClose: () => void;
    scaleId: string;
}

interface Option {
    title: string;
    description?: string;
}

interface Question {
    id: number;
    title: string;
    subtitle?: string;
    options: (string | Option)[];
}

const HAM_D_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Depressed mood (sadness, hopeless, helpless, worthless)',
        options: [
            'Absent',
            'These feeling states indicated only on questioning',
            'These feeling states spontaneously reported verbally',
            'Communicates feeling states non-verbally (facial expression, posture, voice, tendency to weep)',
            'Patient reports virtually only these feeling states in spontaneous verbal and non-verbal communication',
        ],
    },
    {
        id: 2,
        title: 'Feelings of guilt',
        options: [
            'Absent',
            'Self reproach, feels he/she has let people down',
            'Ideas of guilt or rumination over past errors or sinful deeds',
            'Present illness is a punishment. Delusions of guilt',
            'Hears accusatory or denunciatory voices and/or experiences threatening visual hallucinations',
        ],
    },
    {
        id: 3,
        title: 'Suicide',
        options: [
            'Absent',
            'Feels life is not worth living',
            'Wishes he/she were dead or any thoughts of possible death to self',
            'Ideas or gestures of suicide',
            'Attempts at suicide (any serious attempt rates 4)',
        ],
    },
    {
        id: 4,
        title: 'Insomnia: Early in the night',
        options: [
            'No difficulty falling asleep',
            'Complains of occasional difficulty falling asleep (more than ½ hour)',
            'Complains of nightly difficulty falling asleep',
        ],
    },
    {
        id: 5,
        title: 'Insomnia: Middle of the night',
        options: [
            'No difficulty',
            'Patient complains of being restless and disturbed during the night',
            'Waking during the night - any getting out of bed (except for purposes of voiding)',
        ],
    },
    {
        id: 6,
        title: 'Insomnia: Early hours of the morning',
        options: [
            'No difficulty',
            'Waking in early hours of the morning but goes back to sleep',
            'Unable to fall asleep again if gets out of bed',
        ],
    },
    {
        id: 7,
        title: 'Work and activities',
        options: [
            'No difficulty',
            'Thoughts and feelings of incapacity, fatigue or weakness related to activities, work or hobbies',
            'Loss of interest in activity, hobbies or work - either directly reported by the patient or indirect in listlessness, indecision and vacillation',
            'Decrease in actual time spent in activities or decrease in productivity',
            'Stopped working because of present illness',
        ],
    },
    {
        id: 8,
        title: 'Retardation (slowness of thought and speech, impaired ability to concentrate, decreased motor activity)',
        options: [
            'Normal speech and thought',
            'Slight retardation at interview',
            'Obvious retardation at interview',
            'Interview difficult',
            'Complete stupor',
        ],
    },
    {
        id: 9,
        title: 'Agitation',
        options: [
            'None',
            'Fidgetiness',
            'Playing with hands, hair, etc.',
            'Moving about, can\'t sit still',
            'Hand wringing, nail biting, hair-pulling, biting of lips',
        ],
    },
    {
        id: 10,
        title: 'Anxiety psychic',
        options: [
            'No difficulty',
            'Subjective tension and irritability',
            'Worrying about minor matters',
            'Apprehensive attitude apparent in face or speech',
            'Fears expressed without questioning',
        ],
    },
    {
        id: 11,
        title: 'Anxiety somatic (physiological concomitants of anxiety)',
        options: [
            'Absent',
            'Mild',
            'Moderate',
            'Severe',
            'Incapacitating',
        ],
    },
    {
        id: 12,
        title: 'Somatic symptoms gastro-intestinal',
        options: [
            'None',
            'Loss of appetite but eating without encouragement. Heavy feelings in abdomen',
            'Difficulty eating without urging from others. Requests or requires laxatives or medication for bowels or medication for gastrointestinal symptoms',
        ],
    },
    {
        id: 13,
        title: 'Somatic symptoms - General',
        options: [
            'None',
            'Heaviness in limbs, back or head. Backaches, headache, muscle aches. Loss of energy and fatigability',
            'Any clear-cut symptom rates 2',
        ],
    },
    {
        id: 14,
        title: 'Genital symptoms (symptoms such as loss of libido, menstrual disturbances)',
        options: [
            'Absent',
            'Mild',
            'Severe',
        ],
    },
    {
        id: 15,
        title: 'Hypochondriasis',
        options: [
            'Not present',
            'Self-absorption (bodily)',
            'Preoccupation with health',
            'Frequent complaints, requests for help, etc.',
            'Hypochondriacal delusions',
        ],
    },
    {
        id: 16,
        title: 'Loss of weight',
        options: [
            'No weight loss',
            'Probable weight loss associated with present illness',
            'Definite (according to patient) weight loss',
        ],
    },
    {
        id: 17,
        title: 'Insight',
        options: [
            'Acknowledges being depressed and ill',
            'Acknowledges illness but attributes cause to bad food, climate, overwork, virus, need for rest, etc.',
            'Denies being ill at all',
        ],
    },
];

const MADRS_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Reported sadness',
        options: [
            { title: 'Absent', description: 'Occasionally sad in keeping with circumstances' },
            { title: 'Mild', description: 'Sad or downcast but brightens up without difficulty' },
            { title: 'Moderate', description: 'Pervasive feeling of sadness or pessimism. Mood is still influenced by external circumstances' },
            { title: 'Severe', description: 'Continuous or unchanging sadness, misery, or despondency' },
        ],
    },
    {
        id: 2,
        title: 'Apparent sadness',
        options: [
            { title: 'Absent', description: 'No sadness' },
            { title: 'Mild', description: 'Appears disheartened but brightens up without difficulty' },
            { title: 'Moderate', description: 'Appears sad and unhappy most of the time' },
            { title: 'Severe', description: 'Appears very unhappy all the time. Extremely despondent' },
        ],
    },
    {
        id: 3,
        title: 'Inner tension',
        options: [
            { title: 'Absent', description: 'Calm. Only transient inner tension' },
            { title: 'Mild', description: 'Occasional feelings of edginess and ill-defined discomfort' },
            { title: 'Moderate', description: 'Constant feeling of inner tension or intermittent panic which the patient can only master with some difficulty' },
            { title: 'Severe', description: 'Unrelenting dread or anguish. Overwhelming panic' },
        ],
    },
    {
        id: 4,
        title: 'Reduced sleep',
        options: [
            { title: 'Absent', description: 'Sleeps as usual' },
            { title: 'Mild', description: 'Slight difficulty falling asleep or slightly shorter, lighter, or more restless sleep' },
            { title: 'Moderate', description: 'Sleep reduced or broken by at least two hours' },
            { title: 'Severe', description: 'Less than two or three hours of sleep' },
        ],
    },
    {
        id: 5,
        title: 'Reduced appetite',
        options: [
            { title: 'Absent', description: 'Normal or increased appetite' },
            { title: 'Mild', description: 'Slightly reduced appetite' },
            { title: 'Moderate', description: 'No appetite. Food without taste' },
            { title: 'Severe', description: 'Needs persuasion to eat at all' },
        ],
    },
    {
        id: 6,
        title: 'Concentration difficulties',
        options: [
            { title: 'Absent', description: 'No difficulties in concentrating' },
            { title: 'Mild', description: 'Occasional difficulties in collecting one\'s thoughts' },
            { title: 'Moderate', description: 'Difficulties in concentrating and sustaining thought which interferes with reading or conversation' },
            { title: 'Severe', description: 'Inability to read or sustain conversation without great effort' },
        ],
    },
    {
        id: 7,
        title: 'Lassitude',
        options: [
            { title: 'Absent', description: 'Hardly any difficulty in getting started. No sluggishness' },
            { title: 'Mild', description: 'Difficulties in starting activities' },
            { title: 'Moderate', description: 'Difficulties in starting simple routine activities which are carried out only with effort' },
            { title: 'Severe', description: 'Complete lassitude. Unable to do anything without help' },
        ],
    },
    {
        id: 8,
        title: 'Inability to feel',
        options: [
            { title: 'Absent', description: 'Normal interest in the surroundings and in other people' },
            { title: 'Mild', description: 'Reduced ability to enjoy usual interests' },
            { title: 'Moderate', description: 'Loss of interest in the surroundings. Loss of feelings for friends and relatives' },
            { title: 'Severe', description: 'The experience of being emotionally paralysed, inability to feel anger, grief or pleasure and a complete or even painful failure to feel for close relatives and friends' },
        ],
    },
    {
        id: 9,
        title: 'Pessimistic thoughts',
        options: [
            { title: 'Absent', description: 'No pessimistic thoughts' },
            { title: 'Mild', description: 'Fluctuating ideas of failure, self-reproach or self-depreciation' },
            { title: 'Moderate', description: 'Persistent self-accusations, or definite but still rational ideas of guilt or sin. Increasingly pessimistic about the future' },
            { title: 'Severe', description: 'Delusions of ruin, guilt or unpardonable sin. Self-accusations which are absurd and unshakable' },
        ],
    },
    {
        id: 10,
        title: 'Suicidal thoughts',
        options: [
            { title: 'Absent', description: 'Enjoys life or takes it as it comes' },
            { title: 'Mild', description: 'Weary of life. Only fleeting suicidal thoughts' },
            { title: 'Moderate', description: 'Probably better off dead. Suicidal thoughts are common, and suicide is considered as a possible solution, but without specific plans or intention' },
            { title: 'Severe', description: 'Explicit plans for suicide when there is an opportunity. Self-harm preparations' },
        ],
    },
];

const ASRS_OPTIONS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

const ASRS_QUESTIONS: Question[] = [
    { id: 1, title: 'How often do you have trouble finishing the final details of a project after the most demanding parts have been completed?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 2, title: 'How often do you have trouble organizing tasks that require planning?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 3, title: 'How often do you have problems remembering appointments or commitments?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 4, title: 'How often do you avoid or delay starting a task that requires a lot of thinking?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 5, title: 'How often do you fidget or move your hands or feet when you have to sit for a long time?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 6, title: 'How often do you feel overly active and compelled to do things as if you were driven by a motor?', subtitle: 'Part A', options: ASRS_OPTIONS },
    { id: 7, title: 'How often do you make careless mistakes when you have to work on a boring or difficult project?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 8, title: 'How often do you have difficulty keeping your attention when you are working on boring or repetitive work?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 9, title: 'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 10, title: 'How often do you misplace or have difficulty finding things at home or at work?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 11, title: 'How often are you distracted by activity or noise around you?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 12, title: 'How often do you leave your seat in meetings or other situations in which you are expected to remain seated?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 13, title: 'How often do you feel restless or fidgety?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 14, title: 'How often do you have difficulty unwinding and relaxing when you have time to yourself?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 15, title: 'How often do you find yourself talking too much when you are in social situations?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 16, title: 'When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 17, title: 'How often do you have difficulty waiting your turn in situations when turn taking is required?', subtitle: 'Part B', options: ASRS_OPTIONS },
    { id: 18, title: 'How often do you interrupt others when they are busy?', subtitle: 'Part B', options: ASRS_OPTIONS },
];

const HAM_A_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Anxious mood',
        options: [
            { title: 'Not present', description: 'No anxious mood' },
            { title: 'Mild', description: 'Mild worries or anticipation' },
            { title: 'Moderate', description: 'Moderate anxious mood' },
            { title: 'Severe', description: 'Severe anxious mood' },
            { title: 'Very severe', description: 'Overwhelming anxious mood' },
        ],
    },
    {
        id: 2,
        title: 'Tension',
        options: [
            { title: 'Not present', description: 'No tension' },
            { title: 'Mild', description: 'Mild tension or restlessness' },
            { title: 'Moderate', description: 'Moderate tension' },
            { title: 'Severe', description: 'Severe tension' },
            { title: 'Very severe', description: 'Extreme tension, inability to relax' },
        ],
    },
    {
        id: 3,
        title: 'Fears',
        options: [
            { title: 'Not present', description: 'No fears' },
            { title: 'Mild', description: 'Mild fears' },
            { title: 'Moderate', description: 'Moderate fears' },
            { title: 'Severe', description: 'Severe fears' },
            { title: 'Very severe', description: 'Overwhelming fears' },
        ],
    },
    {
        id: 4,
        title: 'Insomnia',
        options: [
            { title: 'Not present', description: 'Normal sleep' },
            { title: 'Mild', description: 'Mild sleep disturbances' },
            { title: 'Moderate', description: 'Moderate insomnia' },
            { title: 'Severe', description: 'Severe insomnia' },
            { title: 'Very severe', description: 'Extreme insomnia preventing rest' },
        ],
    },
    {
        id: 5,
        title: 'Intellectual',
        options: [
            { title: 'Not present', description: 'Normal concentration and memory' },
            { title: 'Mild', description: 'Mild difficulty concentrating' },
            { title: 'Moderate', description: 'Moderate cognitive difficulties' },
            { title: 'Severe', description: 'Severe concentration problems' },
            { title: 'Very severe', description: 'Unable to concentrate' },
        ],
    },
    {
        id: 6,
        title: 'Depressed mood',
        options: [
            { title: 'Not present', description: 'No depression' },
            { title: 'Mild', description: 'Boredom, loss of interest' },
            { title: 'Moderate', description: 'Clearly depressed, weepy' },
            { title: 'Severe', description: 'Deeply depressed, pessimistic' },
            { title: 'Very severe', description: 'Markedly depressed, hopelessness' },
        ],
    },
    {
        id: 7,
        title: 'Somatic symptoms (sensory)',
        options: [
            { title: 'Not present', description: 'No sensory symptoms' },
            { title: 'Mild', description: 'Tinnitus, blurred vision' },
            { title: 'Moderate', description: 'Hot and cold flushes, weakness' },
            { title: 'Severe', description: 'Prickling sensation' },
            { title: 'Very severe', description: 'Extreme discomfort' },
        ],
    },
    {
        id: 8,
        title: 'Somatic symptoms (muscular)',
        options: [
            { title: 'Not present', description: 'No muscular symptoms' },
            { title: 'Mild', description: 'Pains and aches, twitching' },
            { title: 'Moderate', description: 'Muscle stiffness, clonic jerks' },
            { title: 'Severe', description: 'Grinding teeth, unsteady voice' },
            { title: 'Very severe', description: 'Extreme muscular tension' },
        ],
    },
    {
        id: 9,
        title: 'Cardiovascular symptoms',
        options: [
            { title: 'Not present', description: 'No cardiovascular symptoms' },
            { title: 'Mild', description: 'Tachycardia, palpitations' },
            { title: 'Moderate', description: 'Chest pain, throbbing of vessels' },
            { title: 'Severe', description: 'Fainting feelings' },
            { title: 'Very severe', description: 'Extreme cardiac distress' },
        ],
    },
    {
        id: 10,
        title: 'Respiratory symptoms',
        options: [
            { title: 'Not present', description: 'No respiratory symptoms' },
            { title: 'Mild', description: 'Chest pressure, sighing' },
            { title: 'Moderate', description: 'Dyspnea, choking feelings' },
            { title: 'Severe', description: 'Extreme hyperventilation' },
            { title: 'Very severe', description: 'Inability to breathe correctly' },
        ],
    },
    {
        id: 11,
        title: 'Gastrointestinal symptoms',
        options: [
            { title: 'Not present', description: 'No gastrointestinal symptoms' },
            { title: 'Mild', description: 'Difficulty swallowing, wind' },
            { title: 'Moderate', description: 'Abdominal pain, burning sensations' },
            { title: 'Severe', description: 'Nausea, vomiting, looseness of bowels' },
            { title: 'Very severe', description: 'Extreme digestive distress' },
        ],
    },
    {
        id: 12,
        title: 'Genitourinary symptoms',
        options: [
            { title: 'Not present', description: 'No genitourinary symptoms' },
            { title: 'Mild', description: 'Increased frequency of micturition' },
            { title: 'Moderate', description: 'Urgency of micturition, amenorrhea' },
            { title: 'Severe', description: 'Ejaculatio praecox, loss of libido' },
            { title: 'Very severe', description: 'Impotence, severe menstrual issues' },
        ],
    },
    {
        id: 13,
        title: 'Autonomic symptoms',
        options: [
            { title: 'Not present', description: 'No autonomic symptoms' },
            { title: 'Mild', description: 'Dry mouth, flushing' },
            { title: 'Moderate', description: 'Pallor, tendency to sweat' },
            { title: 'Severe', description: 'Giddiness, tension headache' },
            { title: 'Very severe', description: 'Raising of hair, gooseflesh' },
        ],
    },
    {
        id: 14,
        title: 'Behavior at interview',
        options: [
            { title: 'Not present', description: 'Relaxed behavior' },
            { title: 'Mild', description: 'Fidgeting, restless, pacing' },
            { title: 'Moderate', description: 'Tremor of hands, furrowed brow' },
            { title: 'Severe', description: 'Strained face, sighing, rapid breathing' },
            { title: 'Very severe', description: 'Facial pallor, swallowing, etc.' },
        ],
    },
];

const ISI_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Difficulty falling asleep',
        options: [
            { title: 'None', description: 'No problems falling asleep' },
            { title: 'Mild', description: 'Slight difficulties, takes a bit longer than usual' },
            { title: 'Moderate', description: 'Noticeable difficulties, regularly takes a long time' },
            { title: 'Severe', description: 'Significant difficulties, very long time to fall asleep' },
            { title: 'Very Severe', description: 'Extreme difficulties, lying in bed for many hours' },
        ],
    },
    {
        id: 2,
        title: 'Difficulty maintaining sleep',
        options: [
            { title: 'None', description: 'No night awakenings' },
            { title: 'Mild', description: 'Occasional awakenings, easy return to sleep' },
            { title: 'Moderate', description: 'Regular awakenings, some difficulty falling back asleep' },
            { title: 'Severe', description: 'Frequent awakenings, significant difficulty falling back asleep' },
            { title: 'Very Severe', description: 'Constant awakenings, inability to return to sleep' },
        ],
    },
    {
        id: 3,
        title: 'Problems with early morning awakening',
        options: [
            { title: 'None', description: 'Waking up at the planned time' },
            { title: 'Mild', description: 'Waking up slightly early (30 min)' },
            { title: 'Moderate', description: 'Noticeably early waking (1-2 hours)' },
            { title: 'Severe', description: 'Significantly early waking (>2 hours)' },
            { title: 'Very Severe', description: 'Extremely early waking, inability to return to sleep' },
        ],
    },
    {
        id: 4,
        title: 'How satisfied are you with your current sleep pattern?',
        options: [
            { title: 'Very satisfied', description: 'Sleep is satisfying and restorative' },
            { title: 'Satisfied', description: 'Sleep is generally good' },
            { title: 'Moderately satisfied', description: 'Sleep is acceptable but could be better' },
            { title: 'Dissatisfied', description: 'Sleep is insufficient and of poor quality' },
            { title: 'Very dissatisfied', description: 'Sleep is completely unsatisfying' },
        ],
    },
    {
        id: 5,
        title: 'To what extent do you feel that sleep problems interfere with your daily functioning?',
        options: [
            { title: 'Not at all', description: 'No impact on daily functioning' },
            { title: 'Slightly', description: 'Minimal impact on daily activities' },
            { title: 'Moderately', description: 'Noticeable impact on some aspects of life' },
            { title: 'Very much', description: 'Significant impact on most aspects of life' },
            { title: 'Extremely', description: 'Severe impairment of daily functioning' },
        ],
    },
    {
        id: 6,
        title: 'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?',
        options: [
            { title: 'Not at all noticeable', description: 'Sleep problem is not visible to others' },
            { title: 'A little', description: 'Others might occasionally notice signs of fatigue' },
            { title: 'Somewhat', description: 'Sleep problem is sometimes noticeable to others' },
            { title: 'Much', description: 'Sleep problem is clearly visible through daily behavior' },
            { title: 'Very much noticeable', description: 'Others are very aware of sleep difficulties' },
        ],
    },
    {
        id: 7,
        title: 'How worried/distressed are you about your current sleep problem?',
        options: [
            { title: 'Not at all worried', description: 'No concern about sleep problems' },
            { title: 'A little', description: 'Occasional concern or mild worry' },
            { title: 'Somewhat', description: 'Regular concern about sleep quality' },
            { title: 'Much', description: 'Frequently worried and distressed' },
            { title: 'Very much worried', description: 'Constant distress and severe concern' },
        ],
    },
];

const CARS_2_QUESTIONS: Question[] = [
    {
        id: 1,
        title: 'Relationships with people',
        options: [
            { title: 'Within normal limits', description: 'Age-appropriate behavior, no signs of relationship difficulties' },
            { title: 'Mildly atypical', description: 'Slight difficulties in relationships, sometimes avoids eye contact' },
            { title: 'Moderately atypical', description: 'Noticeable difficulties in relationships, often avoids contact' },
            { title: 'Significantly atypical', description: 'Severe difficulties in relationships, rarely initiates contact' },
        ],
    },
    {
        id: 2,
        title: 'Imitation',
        options: [
            { title: 'Within normal limits', description: 'Imitates appropriately for age' },
            { title: 'Mildly atypical', description: 'Imitates most of the time, sometimes needs encouragement' },
            { title: 'Moderately atypical', description: 'Imitates only occasionally, requires significant encouragement' },
            { title: 'Significantly atypical', description: 'Rarely or never imitates' },
        ],
    },
    {
        id: 3,
        title: 'Emotional responses',
        options: [
            { title: 'Within normal limits', description: 'Emotional responses appropriate to situation and age' },
            { title: 'Mildly atypical', description: 'Occasionally inappropriate or exaggerated responses' },
            { title: 'Moderately atypical', description: 'Frequently inappropriate responses, difficulty regulating emotions' },
            { title: 'Significantly atypical', description: 'Extremely inappropriate responses or lack of emotional reactions' },
        ],
    },
    {
        id: 4,
        title: 'Use of body',
        options: [
            { title: 'Within normal limits', description: 'Movements typical for age' },
            { title: 'Mildly atypical', description: 'Slight oddities in movements' },
            { title: 'Moderately atypical', description: 'Noticeable unusual movements, mannerisms' },
            { title: 'Significantly atypical', description: 'Frequent odd movements, rocking, spinning' },
        ],
    },
    {
        id: 5,
        title: 'Use of objects',
        options: [
            { title: 'Within normal limits', description: 'Appropriate use of objects according to their intended purpose' },
            { title: 'Mildly atypical', description: 'Less interest in toys or unusual use' },
            { title: 'Moderately atypical', description: 'Little interest in object function, fascination with parts' },
            { title: 'Significantly atypical', description: 'Focus on unusual aspects of objects, perseveration' },
        ],
    },
    {
        id: 6,
        title: 'Adaptation to change',
        options: [
            { title: 'Within normal limits', description: 'Adapts easily to changes' },
            { title: 'Mildly atypical', description: 'Difficulties with new tasks or changes in routine' },
            { title: 'Moderately atypical', description: 'Strongly resists change, becomes distressed' },
            { title: 'Significantly atypical', description: 'Severe reactions and extreme distress to change' },
        ],
    },
    {
        id: 7,
        title: 'Visual response',
        options: [
            { title: 'Within normal limits', description: 'Normal for age, appropriate eye contact' },
            { title: 'Mildly atypical', description: 'Occasional staring or looking into space' },
            { title: 'Moderately atypical', description: 'Frequent odd use of eyes, looking at objects at odd angles' },
            { title: 'Significantly atypical', description: 'Extreme visual avoidance or focus on odd stimuli' },
        ],
    },
    {
        id: 8,
        title: 'Listening response',
        options: [
            { title: 'Within normal limits', description: 'Normal response for age' },
            { title: 'Mildly atypical', description: 'Sometimes disregards or overreacts to sounds' },
            { title: 'Moderately atypical', description: 'Often disregards sounds or shows peculiar reactions' },
            { title: 'Significantly atypical', description: 'Marked overreaction or complete lack of response to sounds' },
        ],
    },
    {
        id: 9,
        title: 'Taste, smell, and touch response and use',
        options: [
            { title: 'Within normal limits', description: 'Normal use and response to sensory stimuli' },
            { title: 'Mildly atypical', description: 'May occasionally overreact or explore items oddly' },
            { title: 'Moderately atypical', description: 'Frequently preoccupied with smells, tastes, or textures' },
            { title: 'Significantly atypical', description: 'Severe reactions and obsession with sensory stimulations' },
        ],
    },
    {
        id: 10,
        title: 'Fear or nervousness',
        options: [
            { title: 'Within normal limits', description: 'Normal for age and situation' },
            { title: 'Mildly atypical', description: 'Shows slightly more or less fear than expected' },
            { title: 'Moderately atypical', description: 'Fear is frequent, extreme, or lack of fear where expected' },
            { title: 'Significantly atypical', description: 'Persistent fear even after experience or bazaar responses' },
        ],
    },
    {
        id: 11,
        title: 'Verbal communication',
        options: [
            { title: 'Within normal limits', description: 'Normal for age and situation' },
            { title: 'Mildly atypical', description: 'Slow development or slight repetitive patterns' },
            { title: 'Moderately atypical', description: 'Unusual speech, frequent repetition (echolalia)' },
            { title: 'Significantly atypical', description: 'No meaningful speech or highly unusual vocalizations' },
        ],
    },
    {
        id: 12,
        title: 'Nonverbal communication',
        options: [
            { title: 'Within normal limits', description: 'Normal use of gestures and expressions' },
            { title: 'Mildly atypical', description: 'Immature or awkward use of nonverbals' },
            { title: 'Moderately atypical', description: 'Frequent difficulty using gestures and understanding others' },
            { title: 'Significantly atypical', description: 'Peculiar, bizarre, or absent nonverbal communication' },
        ],
    },
    {
        id: 13,
        title: 'Activity level',
        options: [
            { title: 'Within normal limits', description: 'Activity level appropriate for age' },
            { title: 'Mildly atypical', description: 'Slightly hyperactive or lethargic' },
            { title: 'Moderately atypical', description: 'Frequently restless or very sluggish' },
            { title: 'Significantly atypical', description: 'Extreme activity levels, constant motion or lethargy' },
        ],
    },
    {
        id: 14,
        title: 'Level and consistency of intellectual response',
        options: [
            { title: 'Within normal limits', description: 'Normal intelligence and performance consistency' },
            { title: 'Mildly atypical', description: 'Intelligence not as high as it seems or slight delays' },
            { title: 'Moderately atypical', description: 'Significant delays or intellectual discrepancies' },
            { title: 'Significantly atypical', description: 'Severe intellectual impairment or bizarre performance' },
        ],
    },
    {
        id: 15,
        title: 'General impressions',
        options: [
            { title: 'Within normal limits', description: 'No signs of autism' },
            { title: 'Mild symptoms of autism', description: 'Fulfills criteria for mild autism' },
            { title: 'Moderate symptoms of autism', description: 'Shows clear signs of autism' },
            { title: 'Severe symptoms of autism', description: 'Shows extreme symptoms of autism' },
        ],
    },
];

const SCALE_QUESTIONS: Record<string, Question[]> = {
    'HAM-D': HAM_D_QUESTIONS,
    'MADRS': MADRS_QUESTIONS,
    'ASRS': ASRS_QUESTIONS,
    'HAM-A': HAM_A_QUESTIONS,
    'ISI': ISI_QUESTIONS,
    'CARS-2': CARS_2_QUESTIONS,
};

const ScaleQuestionnaireModal = ({ visible, onClose, scaleId }: ScaleQuestionnaireModalProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const questions = SCALE_QUESTIONS[scaleId] || [];
    const totalQuestions = questions.length;
    const question = questions[currentQuestion];
    const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) : 0;

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: optionIndex }));
        // Auto-advance to next question after a brief delay
        if (currentQuestion < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
            }, 300);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        } else {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setCurrentQuestion(0);
        setAnswers({});
        onClose();
    };

    const insets = useSafeAreaInsets();

    if (!question) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={handleCancel}
            statusBarTranslucent
        >
            <View style={[styles.safeArea, { paddingTop: insets.top }]}>
                <StatusBar barStyle="light-content" backgroundColor="#58A7B3" />
                <View style={styles.container}>
                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                    </View>

                    <ScrollView 
                        style={styles.scrollContent}
                        contentContainerStyle={styles.scrollContentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Question Card */}
                        <View style={styles.questionCard}>
                            {/* Question Header */}
                            <View style={styles.questionHeader}>
                                <View>
                                    <Text style={styles.questionNumber}>
                                        Question {currentQuestion + 1} z {totalQuestions}
                                    </Text>
                                    {question.subtitle && (
                                        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
                                    )}
                                </View>
                                <TouchableOpacity style={styles.infoButton}>
                                    <Ionicons name="information-circle-outline" size={24} color="#58A7B3" />
                                </TouchableOpacity>
                            </View>

                            {/* Question Title */}
                            <Text style={styles.questionTitle}>{question.title}</Text>

                            {/* Options */}
                            <View style={styles.optionsContainer}>
                                {question.options.map((option, index) => {
                                    const isSelected = answers[currentQuestion] === index;
                                    const optionTitle = typeof option === 'string' ? option : option.title;
                                    const optionDesc = typeof option === 'string' ? null : option.description;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.optionCard,
                                                isSelected && styles.optionCardSelected,
                                            ]}
                                            onPress={() => handleSelectOption(index)}
                                            activeOpacity={0.7}
                                        >
                                            <View>
                                                <Text style={[
                                                    styles.optionText,
                                                    isSelected && styles.optionTextSelected,
                                                ]}>
                                                    {optionTitle}
                                                </Text>
                                                {optionDesc && (
                                                    <Text style={styles.optionDescription}>
                                                        {optionDesc}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Feather name="arrow-left" size={16} color="#58A7B3" />
                            <Text style={styles.backButtonText}>
                                {currentQuestion === 0 ? 'Cancel' : 'Back'}
                            </Text>
                        </TouchableOpacity>

                        {currentQuestion === totalQuestions - 1 && (
                            <TouchableOpacity onPress={handleCancel}>
                                <LinearGradient
                                    colors={['#58A7B3', '#8ED1CC']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.finishButton}
                                >
                                    <Text style={styles.finishButtonText}>Finish</Text>
                                    <Feather name="arrow-right" size={16} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#E2E8F0',
        width: '100%',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#58A7B3',
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    questionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    questionSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    infoButton: {
        padding: 2,
    },
    questionTitle: {
        fontSize: 16,
        color: '#1E293B',
        lineHeight: 24,
        marginBottom: 20,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingVertical: hp(2),
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    optionCardSelected: {
        borderColor: '#58A7B3',
        borderWidth: 2,
        backgroundColor: '#F0FAFB',
    },
    optionText: {
        fontSize: 15,
        color: '#1E293B',
        lineHeight: 22,
    },
    optionTextSelected: {
        color: '#1E293B',
        fontWeight: '700',
    },
    optionDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: hp(5),
        backgroundColor: '#F8FAFC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#58A7B3',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: wp(10),
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: wp(10),
    },
    finishButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '700',
        marginRight: 6,
    },
    backButtonText: {
        fontSize: 14,
        color: '#58A7B3',
        fontWeight: '700',
        marginLeft: 6,
    },
});

export default ScaleQuestionnaireModal;
