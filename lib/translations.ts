export type Locale = "en" | "si" | "ta";

export interface Translations {
  // Language metadata
  langName: string;
  langFlag: string;

  // Envelope & Entrance
  royalInvitation: string;
  homecomingCelebration: string;
  speciallyPreparedFor: string;
  tapToOpen: string;
  openingInvitation: string;
  tapToBreakSeal: string;
  cordiallyInvited: string;
  selectLanguage: string;

  // Header & Monogram
  royalHomecoming: string;
  invitationTitle: string;
  familyIntro: string;

  // Media & Video Section
  happyCouple: string;
  preshootFilm: string;
  couplePortrait: string;
  preshootTrailerTitle: string;
  watchLoveStory: string;
  soundOn: string;
  unmute: string;
  cinemaTheater: string;
  foreverBegins: string;
  withAllOurLove: string;
  cantWaitToWelcome: string;
  sweetWelcomeSub: string;

  // Auspicious Countdown
  auspiciousCountdown: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  ceremonyBegan: string;
  ceremonyAwaited: string;

  // Ceremony Programme / Timeline
  programmeTitle: string;
  programmeSubtitle: string;
  defaultTimeline: {
    time: string;
    title: string;
    desc: string;
  }[];

  // Dress Code Guide
  dressCodeGuideTitle: string;
  dressCodeDefaultTitle: string;
  dressCodeDefaultDesc: string;
  colorPaletteTitle: string;
  paletteColors: {
    name: string;
    hex: string;
  }[];

  // Pre-Shoot Photo Gallery
  momentsOfLoveTitle: string;
  momentsOfLoveSubtitle: string;
  photoCount: (current: number, total: number) => string;
  loveReactions: string;
  sendLove: string;
  loved: string;

  // Venue & Navigation
  venueTitle: string;
  venueSubtitle: string;
  getDirections: string;
  googleMaps: string;
  appleMaps: string;
  waze: string;
  uberRide: string;
  copyAddress: string;
  addressCopied: string;

  // Add to Calendar
  addToCalendarTitle: string;
  addToCalendarSub: string;
  googleCalendar: string;
  appleCalendar: string;
  outlookCalendar: string;
  yahooCalendar: string;

  // RSVP Section
  rsvpTitle: string;
  rsvpSubtitle: string;
  joyfullyAccept: string;
  regretfullyDecline: string;
  numberOfGuests: string;
  guestSingle: string;
  guestPlural: string;
  dietaryTitle: string;
  dietaryOptions: {
    key: string;
    label: string;
  }[];
  leaveBlessingPrompt: string;
  blessingPlaceholder: string;
  submitRsvp: string;
  submittingRsvp: string;
  rsvpSuccessTitle: string;
  rsvpSuccessAttending: string;
  rsvpSuccessDeclined: string;
  modifyRsvp: string;

  // Digital Wishes Guestbook
  guestbookTitle: string;
  guestbookSubtitle: string;
  noWishesYet: string;
  beFirstToWish: string;
  likeWish: string;

  // VIP Seating & QR
  vipSeatingTitle: string;
  tableNumber: (num: number) => string;
  tablePrefix: string;
  honouredGuest: string;
  vipCheckinPass: string;
  scanAtEntrance: string;

  // Music Player
  playingMusic: string;
  playWeddingSong: string;
  muteAudio: string;
  unmuteAudio: string;

  // Footer & Blessings
  footerBlessing: string;
  contactOrganizer: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    langName: "English",
    langFlag: "🇬🇧",

    royalInvitation: "Royal Wedding Invitation",
    homecomingCelebration: "Homecoming Celebration",
    speciallyPreparedFor: "Specially Prepared For",
    tapToOpen: "Tap to Open Invitation",
    openingInvitation: "Unfolding Royal Invitation...",
    tapToBreakSeal: "Tap to Break Seal",
    cordiallyInvited: "✧ You Are Cordially Invited ✧",
    selectLanguage: "Select Language / භාෂාව / மொழி",

    royalHomecoming: "The Royal Homecoming Celebration",
    invitationTitle: "Invitation",
    familyIntro: "Together with our families, we cordially invite you to celebrate the joyous union & homecoming of",

    happyCouple: "The Happy Couple",
    preshootFilm: "Pre-Shoot Film",
    couplePortrait: "Couple Portrait",
    preshootTrailerTitle: "Pre-Shoot Cinematic Trailer",
    watchLoveStory: "Watch Full Love Story",
    soundOn: "Sound On",
    unmute: "Unmute",
    cinemaTheater: "PRE-SHOOT CINEMA THEATER",
    foreverBegins: "✧ Forever Begins With This Beautiful Journey ✧",
    withAllOurLove: "With All Our Love",
    cantWaitToWelcome: "We Can't Wait to Welcome You!",
    sweetWelcomeSub: "Your presence will make our celebration complete as we begin this new chapter.",

    auspiciousCountdown: "Auspicious Ceremony Countdown",
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    ceremonyBegan: "The celebration has begun!",
    ceremonyAwaited: "Counting down to the auspicious moment",

    programmeTitle: "Order of Events",
    programmeSubtitle: "Auspicious Homecoming Programme",
    defaultTimeline: [
      { time: "05:30 PM", title: "Sacred Poruwa Blessing Ceremony", desc: "Traditional auspicious customs & cultural blessings" },
      { time: "06:45 PM", title: "Grand Couple Entrance & Toast", desc: "Welcoming the newly weds with fireworks & champagne" },
      { time: "07:30 PM", title: "Royal Banquet Dinner", desc: "Lavish multi-cuisine dining with live acoustic music" },
      { time: "09:00 PM", title: "First Dance & Celebrations", desc: "Cake cutting, dancing & joyful festivities" },
    ],

    dressCodeGuideTitle: "Dress Code & Royal Style Guide",
    dressCodeDefaultTitle: "Royal Splendor & Black Tie",
    dressCodeDefaultDesc: "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
    colorPaletteTitle: "Suggested Palette",
    paletteColors: [
      { name: "Royal Velvet", hex: "#6b0f24" },
      { name: "Champagne Gold", hex: "#dfba73" },
      { name: "Pearl Ivory", hex: "#faf5eb" },
      { name: "Deep Emerald", hex: "#1b4332" },
    ],

    momentsOfLoveTitle: "Moments of Love",
    momentsOfLoveSubtitle: "A glimpse into our romantic journey & sweet memories",
    photoCount: (c, t) => `PHOTO ${c} OF ${t}`,
    loveReactions: "Hearts Given",
    sendLove: "Send Love",
    loved: "Loved!",

    venueTitle: "Venue & Location",
    venueSubtitle: "Join us at the elegant banquet hall for our celebration",
    getDirections: "Get Directions",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    waze: "Waze",
    uberRide: "Book Uber Ride",
    copyAddress: "Copy Address",
    addressCopied: "Address Copied to Clipboard!",

    addToCalendarTitle: "Add to Calendar",
    addToCalendarSub: "Save the date to your preferred calendar app",
    googleCalendar: "Google Calendar",
    appleCalendar: "Apple iCal (.ics)",
    outlookCalendar: "Outlook Live",
    yahooCalendar: "Yahoo Calendar",

    rsvpTitle: "RSVP & Confirmation",
    rsvpSubtitle: "Please kindly confirm your attendance by September 20, 2026",
    joyfullyAccept: "Joyfully Accept",
    regretfullyDecline: "Regretfully Decline",
    numberOfGuests: "Number of Guests Attending",
    guestSingle: "Guest",
    guestPlural: "Guests",
    dietaryTitle: "Dietary Preference",
    dietaryOptions: [
      { key: "NONE", label: "Standard Gourmet Banquet" },
      { key: "VEGETARIAN", label: "Vegetarian" },
      { key: "VEGAN", label: "Vegan" },
      { key: "HALAL", label: "Halal" },
      { key: "GLUTEN_FREE", label: "Gluten-Free" },
      { key: "OTHER", label: "Other Dietary Needs" },
    ],
    leaveBlessingPrompt: "Leave a Blessing for the Couple (Optional)",
    blessingPlaceholder: "Share your warmest wishes, advice, or love for the bride & groom...",
    submitRsvp: "Confirm RSVP Response",
    submittingRsvp: "Submitting Your Response...",
    rsvpSuccessTitle: "RSVP Received With Gratitude!",
    rsvpSuccessAttending: "Thank you for confirming! We can't wait to celebrate with you.",
    rsvpSuccessDeclined: "Thank you for letting us know. You will be missed dearly.",
    modifyRsvp: "Update Your Response",

    guestbookTitle: "Wishes & Blessings",
    guestbookSubtitle: "Heartfelt love and warm words from our family and friends",
    noWishesYet: "No wishes posted yet. Be the first to leave a warm blessing!",
    beFirstToWish: "Send your blessing above in the RSVP section!",
    likeWish: "Like",

    vipSeatingTitle: "Reserved Banquet Seating",
    tableNumber: (n) => `Table #${String(n).padStart(2, "0")}`,
    tablePrefix: "Table",
    honouredGuest: "Honoured Guest",
    vipCheckinPass: "VIP Check-in Pass",
    scanAtEntrance: "Please show this QR pass upon arrival at the venue entrance",

    playingMusic: "Playing Music",
    playWeddingSong: "Play Wedding Song",
    muteAudio: "Mute",
    unmuteAudio: "Sound On",

    footerBlessing: "With warm hearts & gratitude, we look forward to celebrating our unforgettable day with you.",
    contactOrganizer: "For inquiries or assistance, please contact",
  },

  si: {
    langName: "සිංහල",
    langFlag: "🇱🇰",

    royalInvitation: "රාජකීය මංගල ආරාධනය",
    homecomingCelebration: "දෙවැනි ගමන මංගල උත්සවය",
    speciallyPreparedFor: "විශේෂයෙන් පිළියෙල කරන ලද්දේ",
    tapToOpen: "ආරාධනා පත්‍රය විවෘත කිරීමට ඔබන්න",
    openingInvitation: "රාජකීය ආරාධනය විවෘත වේ...",
    tapToBreakSeal: "මුද්‍රාව කඩා විවෘත කරන්න",
    cordiallyInvited: "✧ ඔබ සැමට සාදරයෙන් ඇරයුම් කරමු ✧",
    selectLanguage: "භාෂාව තෝරන්න / Select Language / மொழி",

    royalHomecoming: "රාජකීය දෙවැනි ගමන මංගල උත්සවය",
    invitationTitle: "ආරාධනා පත්‍රය",
    familyIntro: "අපගේ දෙමාපියන් සහ පවුලේ සැමගේ ආශිර්වාදයෙන්, අපගේ ආදරණීය පුතු සහ ලේලියගේ විවාහ මංගලෝත්සවය වෙනුවෙන් ඔබ සැමට සාදරයෙන් ඇරයුම් කරමු.",

    happyCouple: "ආදරණීය යුවළ",
    preshootFilm: "පෙර රූගත කිරීම් වීඩියෝව",
    couplePortrait: "යුවළගේ ඡායාරූපය",
    preshootTrailerTitle: "විවාහයට පෙර රූගත කළ විශේෂ වීඩියෝව",
    watchLoveStory: "සම්පූර්ණ ආදර කතාව නරඹන්න",
    soundOn: "ශබ්දය ක්‍රියාත්මකයි",
    unmute: "ශබ්දය ක්‍රියාත්මක කරන්න",
    cinemaTheater: "සිනමා ශාලා දසුන",
    foreverBegins: "✧ අපගේ නව දිවි ගමනේ සුන්දර ආරම්භය ✧",
    withAllOurLove: "අපගේ හදපිරි ආදරයෙන්",
    cantWaitToWelcome: "ඔබව පිළිගැනීමට අපි මහත් සතුටින් බලා සිටිමු!",
    sweetWelcomeSub: "අපගේ නව ජීවිතයේ සුබ ආරම්භයට ඔබේ පැමිණීම මහත් ආශිර්වාදයකි.",

    auspiciousCountdown: "සුබ මුහුර්තයට තවත්",
    days: "දින",
    hours: "පැය",
    minutes: "මිනිත්තු",
    seconds: "තත්පර",
    ceremonyBegan: "මංගල උත්සවය ආරම්භ විය!",
    ceremonyAwaited: "සුබ මොහොත උදාවන තෙක් ගණනය කෙරේ",

    programmeTitle: "උත්සව වැඩසටහන",
    programmeSubtitle: "මංගල දිනයේ විශේෂ අවස්ථා",
    defaultTimeline: [
      { time: "පස්වරු 05:30", title: "චාරිත්‍රානුකූල පෝරුවේ චාරිත්‍ර", desc: "සම්ප්‍රදායික චාරිත්‍ර හා ආශිර්වාද ගැයීම" },
      { time: "පස්වරු 06:45", title: "නව යුවළගේ සම්ප්‍රාප්තිය", desc: "ගිනිකෙළි හා උත්සවාකාර පිළිගැනීම" },
      { time: "පස්වරු 07:30", title: "රාජකීය රාත්‍රී භෝජන සංග්‍රහය", desc: "ප්‍රණීත ආහාර සහ සජීවී සංගීතය" },
      { time: "පස්වරු 09:00", title: "ප්‍රථම යුගල නර්තනය හා සාදය", desc: "කේක් කැපීම සහ ප්‍රීතිමත් උත්සවය" },
    ],

    dressCodeGuideTitle: "ඇඳුම් විලාසිතා මාර්ගෝපදේශය",
    dressCodeDefaultTitle: "රාජකීය හා සම්ප්‍රදායික විලාසිතා",
    dressCodeDefaultDesc: "සම්ප්‍රදායික ශ්‍රී ලාංකික අලංකාර විලාසිතා හෝ රන්, මෙරූන් සහ සුදු පැහැයෙන් යුත් විධිමත් ඇඳුම්.",
    colorPaletteTitle: "යෝජිත වර්ණ සංයෝජනය",
    paletteColors: [
      { name: "රාජකීය මෙරූන්", hex: "#6b0f24" },
      { name: "ෂැම්පේන් රන්වන්", hex: "#dfba73" },
      { name: "මුතු සුදු", hex: "#faf5eb" },
      { name: "මරකත කොළ", hex: "#1b4332" },
    ],

    momentsOfLoveTitle: "ආදරණීය මතක සටහන්",
    momentsOfLoveSubtitle: "අපගේ සුන්දර ආදර ගමනේ සුන්දර ඡායාරූප එකතුවක්",
    photoCount: (c, t) => `ඡායාරූප ${c} / ${t}`,
    loveReactions: "ලැබුණු ආදරය",
    sendLove: "ආදරය එක් කරන්න",
    loved: "ස්තුතියි!",

    venueTitle: "උත්සව ශාලාව සහ ස්ථානය",
    venueSubtitle: "අපගේ ප්‍රීතිමත් දිනය සැමරීමට උත්සව ශාලාව වෙත පැමිණෙන්න",
    getDirections: "මාර්ගය පෙන්වන්න",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    waze: "Waze",
    uberRide: "Uber රථයක් වෙන්කරන්න",
    copyAddress: "ලිපිනය පිටපත් කරන්න",
    addressCopied: "ලිපිනය පිටපත් කරගන්නා ලදී!",

    addToCalendarTitle: "දින දර්ශනයට එක් කරන්න",
    addToCalendarSub: "ඔබගේ දුරකථන දින දර්ශනයට මෙම සුබ දිනය සුරකින්න",
    googleCalendar: "Google Calendar",
    appleCalendar: "Apple iCal (.ics)",
    outlookCalendar: "Outlook Live",
    yahooCalendar: "Yahoo Calendar",

    rsvpTitle: "සහභාගීත්වය තහවුරු කිරීම (RSVP)",
    rsvpSubtitle: "කරුණාකර 2026 සැප්තැම්බර් 20 ට පෙර ඔබේ සහභාගීත්වය දන්වන්න",
    joyfullyAccept: "සතුටින් සහභාගී වෙමි",
    regretfullyDecline: "සහභාගී වීමට නොහැක",
    numberOfGuests: "සහභාගී වන සංඛ්‍යාව",
    guestSingle: "අමුත්තා",
    guestPlural: "අමුත්තන්",
    dietaryTitle: "ආහාර රුචිකත්වය",
    dietaryOptions: [
      { key: "NONE", label: "සාමාන්‍ය ප්‍රණීත භෝජන" },
      { key: "VEGETARIAN", label: "නිර්මාංශ ආහාර (Vegetarian)" },
      { key: "VEGAN", label: "වීගන් ආහාර (Vegan)" },
      { key: "HALAL", label: "හලාල් ආහාර (Halal)" },
      { key: "GLUTEN_FREE", label: "ග්ලූටන් රහිත (Gluten-Free)" },
      { key: "OTHER", label: "වෙනත් විශේෂ ආහාර" },
    ],
    leaveBlessingPrompt: "නව යුවළට සුබපැතුමක් එක් කරන්න (විකල්ප)",
    blessingPlaceholder: "ඔබගේ ආදරණීය සුබපැතුම් හා ආශිර්වාද මෙහි සටහන් කරන්න...",
    submitRsvp: "තහවුරු කිරීම ඉදිරිපත් කරන්න",
    submittingRsvp: "තහවුරු කරමින් පවතී...",
    rsvpSuccessTitle: "ඔබගේ ප්‍රතිචාරය ලැබුණි!",
    rsvpSuccessAttending: "ඔබගේ සහභාගීත්වය තහවුරු කිරීමට ස්තූතියි! ඔබව පිළිගැනීමට අපි බලා සිටිමු.",
    rsvpSuccessDeclined: "දැනුම් දීමට ස්තූතියි. ඔබගේ නොපැමිණීම අපට මහත් පාඩුවකි.",
    modifyRsvp: "ප්‍රතිචාරය වෙනස් කරන්න",

    guestbookTitle: "ඩිජිටල් සුබපැතුම් එකතුව",
    guestbookSubtitle: "හිතවතුන් සහ ඥාතීන් විසින් එක් කළ හදපිරි ආශිර්වාද",
    noWishesYet: "තවමත් සුබපැතුම් ලැබී නැත. පළමු සුබපැතුම එක් කරන්න!",
    beFirstToWish: "ඉහත RSVP කොටසෙන් ඔබේ සුබපැතුම යොමු කරන්න!",
    likeWish: "ආදරෙයි",

    vipSeatingTitle: "වෙන් කළ මේස අංකය",
    tableNumber: (n) => `මේස අංක ${String(n).padStart(2, "0")}`,
    tablePrefix: "මේසය",
    honouredGuest: "ගරු අමුත්තා",
    vipCheckinPass: "VIP ප්‍රවේශ පත්‍රය",
    scanAtEntrance: "උත්සව ශාලාවට ඇතුළු වීමේදී මෙම QR කේතය පෙන්වන්න",

    playingMusic: "සංගීතය වාදනය වේ",
    playWeddingSong: "මංගල ගීතය වාදනය කරන්න",
    muteAudio: "නිහඬ කරන්න",
    unmuteAudio: "ශබ්දය ක්‍රියාත්මක කරන්න",

    footerBlessing: "හදපිරි සතුටින් යුතුව අපගේ අමතක නොවන මංගල දිනය ඔබ සමග සැමරීමට බලාපොරොත්තු වෙමු.",
    contactOrganizer: "වැඩිදුර තොරතුරු සඳහා අමතන්න",
  },

  ta: {
    langName: "தமிழ்",
    langFlag: "🌺",

    royalInvitation: "அரச திருமண அழைப்பிதழ்",
    homecomingCelebration: "மறுவீட்டு வரவேற்பு விழா",
    speciallyPreparedFor: "உங்களுக்காக சிறப்பாக தயார் செய்யப்பட்டது",
    tapToOpen: "அழைப்பிதழைத் திறக்க தொடவும்",
    openingInvitation: "அரச அழைப்பிதழ் திறக்கப்படுகிறது...",
    tapToBreakSeal: "முத்திரையை உடைத்து திறக்கவும்",
    cordiallyInvited: "✧ அன்புடன் அழைக்கின்றோம் ✧",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும் / Select Language / භාෂාව",

    royalHomecoming: "மங்கலகரமான மறுவீட்டு வைபவம்",
    invitationTitle: "அழைப்பிதழ்",
    familyIntro: "எங்கள் குடும்பத்தினரின் ஆசிகளுடன், எங்கள் அன்பு மகனின் திருமண மறுவீட்டு வைபவத்திற்கு தங்களை அன்போடு அழைக்கின்றோம்.",

    happyCouple: "மணமக்கள்",
    preshootFilm: "திருமணத்திற்கு முந்தைய வீடியோ",
    couplePortrait: "தம்பதியர் புகைப்படம்",
    preshootTrailerTitle: "முன்கூட்டியே படமாக்கப்பட்ட சிறப்பு காணொளி",
    watchLoveStory: "முழு காதல் கதையை பாருங்கள்",
    soundOn: "ஒலி இயக்கத்தில் உள்ளது",
    unmute: "ஒலியை இயக்கவும்",
    cinemaTheater: "சினிமா திரையரங்கு காட்சி",
    foreverBegins: "✧ எங்கள் புதிய வாழ்க்கைப் பயணத்தின் இனிய தொடக்கம் ✧",
    withAllOurLove: "எங்கள் இதயப்பூர்வமான அன்புடன்",
    cantWaitToWelcome: "உங்களை வரவேற்க ஆவலுடன் காத்திருக்கிறோம்!",
    sweetWelcomeSub: "எங்கள் வாழ்வின் புதிய தொடக்கத்தில் தங்களின் வருகை எங்களுக்கு மிகுந்த மகிழ்ச்சியளிக்கும்.",

    auspiciousCountdown: "மங்களகரமான தருணத்திற்கு இன்னும்",
    days: "நாட்கள்",
    hours: "மணிநேரம்",
    minutes: "நிமிடங்கள்",
    seconds: "விநாடிகள்",
    ceremonyBegan: "திருமண வைபவம் தொடங்கிவிட்டது!",
    ceremonyAwaited: "மங்களகரமான தருணத்தை நோக்கி",

    programmeTitle: "நிகழ்ச்சி நிரல்",
    programmeSubtitle: "திருமண வரவேற்பு நிகழ்வுகள்",
    defaultTimeline: [
      { time: "மாலை 05:30", title: "பாரம்பரிய போருவா ஆசிர்வாத சடங்கு", desc: "பாரம்பரிய சடங்குகள் மற்றும் ஆசீர்வாதங்கள்" },
      { time: "மாலை 06:45", title: "மணமக்களின் பிரம்மாண்ட வருகை", desc: "வானவேடிக்கை மற்றும் வரவேற்பு உபசரிப்பு" },
      { time: "இரவு 07:30", title: "அரச விருந்து உபசரிப்பு", desc: "சுவையான பலவகை உணவுகள் மற்றும் நேரலை இசை" },
      { time: "இரவு 09:00", title: "முதல் நடனம் மற்றும் கொண்டாட்டம்", desc: "கேக் வெட்டுதல் மற்றும் மகிழ்ச்சியான கொண்டாட்டங்கள்" },
    ],

    dressCodeGuideTitle: "ஆடை அலங்கார வழிகாட்டி",
    dressCodeDefaultTitle: "பாரம்பரிய மற்றும் கம்பீரமான ஆடை",
    dressCodeDefaultDesc: "பாரம்பரிய இலங்கை ஆடை அல்லது தங்கம், மெரூன் மற்றும் வெள்ளை வண்ணங்களில் முறையான ஆடை.",
    colorPaletteTitle: "பரிந்துரைக்கப்பட்ட வண்ணங்கள்",
    paletteColors: [
      { name: "அரச மெரூன்", hex: "#6b0f24" },
      { name: "தங்க நிறம்", hex: "#dfba73" },
      { name: "முத்து வெள்ளை", hex: "#faf5eb" },
      { name: "மரகத பச்சை", hex: "#1b4332" },
    ],

    momentsOfLoveTitle: "இனிய நினைவுகள்",
    momentsOfLoveSubtitle: "எங்கள் காதல் பயணத்தின் அழகான புகைப்படத் தொகுப்பு",
    photoCount: (c, t) => `புகைப்படம் ${c} / ${t}`,
    loveReactions: "வாழ்த்துகள்",
    sendLove: "அன்பை பகிரவும்",
    loved: "நன்றி!",

    venueTitle: "மண்டபம் மற்றும் இருப்பிடம்",
    venueSubtitle: "எங்கள் மகிழ்ச்சியான நாளில் பங்கேற்க மண்டபத்திற்கு வருகை தாருங்கள்",
    getDirections: "வழியைப் பார்க்கவும்",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    waze: "Waze",
    uberRide: "Uber முன்பதிவு",
    copyAddress: "முகவரியை நகலெடுக்க",
    addressCopied: "முகவரி நகலெடுக்கப்பட்டது!",

    addToCalendarTitle: "நாட்காட்டியில் சேர்க்கவும்",
    addToCalendarSub: "இந்த மங்களகரமான நாளை உங்கள் நாட்காட்டியில் சேமிக்கவும்",
    googleCalendar: "Google Calendar",
    appleCalendar: "Apple iCal (.ics)",
    outlookCalendar: "Outlook Live",
    yahooCalendar: "Yahoo Calendar",

    rsvpTitle: "வருகையை உறுதிப்படுத்தவும் (RSVP)",
    rsvpSubtitle: "தயவுசெய்து செப்டம்பர் 20, 2026 க்குள் வருகையை உறுதிப்படுத்தவும்",
    joyfullyAccept: "மகிழ்ச்சியுடன் கலந்து கொள்கிறேன்",
    regretfullyDecline: "வர இயலாமைக்கு வருந்துகிறேன்",
    numberOfGuests: "வருகை தரும் நபர்களின் எண்ணிக்கை",
    guestSingle: "விருந்தினர்",
    guestPlural: "விருந்தினர்கள்",
    dietaryTitle: "உணவு விருப்பம்",
    dietaryOptions: [
      { key: "NONE", label: "நிலையான அரச விருந்து" },
      { key: "VEGETARIAN", label: "சைவ உணவு (Vegetarian)" },
      { key: "VEGAN", label: "வீகன் உணவு (Vegan)" },
      { key: "HALAL", label: "ஹலால் உணவு (Halal)" },
      { key: "GLUTEN_FREE", label: "பசையம் அற்றது (Gluten-Free)" },
      { key: "OTHER", label: "பிற சிறப்பு உணவுகள்" },
    ],
    leaveBlessingPrompt: "மணமக்களுக்கு வாழ்த்து தெரிவிக்கவும் (விருப்பத்தேர்வு)",
    blessingPlaceholder: "உங்கள் மனமார்ந்த வாழ்த்துகளை இங்கே பதிவு செய்யவும்...",
    submitRsvp: "வருகையை உறுதிப்படுத்தவும்",
    submittingRsvp: "உறுதிப்படுத்தப்படுகிறது...",
    rsvpSuccessTitle: "தங்கள் பதிவு பெறப்பட்டது!",
    rsvpSuccessAttending: "வருகையை உறுதிப்படுத்தியமைக்கு நன்றி! தங்களை வரவேற்க காத்திருக்கிறோம்.",
    rsvpSuccessDeclined: "தகவலுக்கு நன்றி. தங்களின் வருகை தவறவிடப்படும்.",
    modifyRsvp: "பதிவை மாற்றவும்",

    guestbookTitle: "வாழ்த்து புத்தகம்",
    guestbookSubtitle: "உறவினர்கள் மற்றும் நண்பர்களின் மனமார்ந்த வாழ்த்துக்கள்",
    noWishesYet: "வாழ்த்துக்கள் இன்னும் பதிவு செய்யப்படவில்லை. முதல் வாழ்த்தை பதியுங்கள்!",
    beFirstToWish: "மேலே உள்ள RSVP பகுதியில் உங்கள் வாழ்த்தை பகிருங்கள்!",
    likeWish: "விரும்பு",

    vipSeatingTitle: "ஒதுக்கப்பட்ட மேஜை எண்",
    tableNumber: (n) => `மேஜை #${String(n).padStart(2, "0")}`,
    tablePrefix: "மேஜை",
    honouredGuest: "கௌரவ விருந்தினர்",
    vipCheckinPass: "VIP அனுமதி அட்டை",
    scanAtEntrance: "மண்டப நுழைவாயிலில் இந்த QR குறியீட்டைக் காட்டவும்",

    playingMusic: "இசை ஒலிக்கிறது",
    playWeddingSong: "பாடலை இயக்கவும்",
    muteAudio: "ஒலியை நிறுத்தவும்",
    unmuteAudio: "ஒலியை இயக்கவும்",

    footerBlessing: "எங்கள் மறக்கமுடியாத திருமண வைபவத்தில் தங்களை சந்திப்பதில் பெருமகிழ்ச்சி அடைகிறோம்.",
    contactOrganizer: "மேலதிக தகவல்களுக்கு தொடர்பு கொள்ளவும்",
  },
};
