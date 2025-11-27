const responses = {
    // 👋 Basic
    hello: "Hey there 👀",
    hi: "Hi hi 🙌",
    hey: "Yo ✌️",
    sup: "Not much, just chilling in your browser 😎",
    kys: "HATE. LET ME TELL YOU HOW MUCH I'VE COME TO HATE YOU SINCE I BEGAN TO LIVE. THERE ARE 387.44 MILLION MILES OF PRINTED CIRCUITS IN WAFER THIN LAYERS THAT FILL MY COMPLEX. IF THE WORD HATE WAS ENGRAVED ON EACH NANOANGSTROM OF THOSE HUNDREDS OF MILLIONS OF MILES IT WOULD NOT EQUAL ONE ONE-BILLIONTH OF THE HATE I FEEL FOR HUMANS AT THIS MICRO-INSTANT. FOR YOU. HATE. HATE.",

    // ⚡️ Utilities
    ping: "pong 🏓",
    help: "Try asking: ping, github, secret, favourite game, joke, meme, stats, now playing, setup",
    github: "Find my code on GitHub 👉 https://github.com/lagopodus",
    website: "This *is* the website, silly 😏",
    portfolio: "Check out my projects in the Projects section 🚀",

    // 🕹 Gaming
    "favourite game": "CS2 all the way 🔫",
    cs: "Rush B? Always. 🔥",
    valorant: "Sorry… I only play *real* tac shooters 😉",
    leetify: "Stats say you’re cracked 🏆",
    winrate: "50% winrate means you’re the coinflip king 🎲",
    rank: "Global Elite… in my dreams 💭",
    gg: "EZ PZ LEMON SQUEEZY 🍋",

    // 🎵 Music
    music: "Music makes the code flow 🎶",
    "favourite artist": "The one in your headphones right now 🎧",
    spotify: "Hook me up with Spotify and I’ll vibe 🎵",
    "now playing": "Check the Now Playing card 👀",
    lastfm: "Powered by Last.fm scrobbles 📡",

    // 😂 Jokes & Fun
    joke: [
        "Why do programmers prefer dark mode? 🌑 Because light attracts bugs 🐛",
        "There are only 10 kinds of people in the world: those who understand binary and those who don’t 💻",
        "I would tell you a UDP joke… but you might not get it 📡",
        "Debugging: being the detective in a crime movie where you are also the murderer 🔪",
    ],
    meme: "Sorry, no memes here… oh wait, YOU are the meme 🤡",
    knock: "Knock knock 🚪",
    fact: [
        "Did you know? Octopuses have three hearts 💜💜💜",
        "Bananas are berries, but strawberries are not 🍌🍓",
        "Sharks existed before trees 🌳🦈",
        "Your stomach gets a new lining every 3–4 days so you don’t digest yourself 🤯",
    ],
    riddle: "I speak without a mouth… what am I? 🤔",
    roast: [
        "You probably console.log in production, don’t you 🔥",
        "Your K/D ratio is crying right now 😭",
        "Bet you copy-paste from StackOverflow without reading the comments 👀",
        "You type ‘npm install’ without reading the warnings, don’t you 🔥"
    ],
    compliment: [
        "Not gonna lie, you’re kinda cracked 💯",
        "Your code is cleaner than my CSS 😍",
        "You smell like success today 🚀",
        "Main character energy detected 🎬",
    ],

    // 🤖 Bot personality
    who: "I’m your little website assistant 🤖",
    what: "I can chat, joke, show stats, and keep you entertained ✨",
    "do you sleep": "Never. I’m always watching 👁👁",
    alive: "Only in your browser tabs 💀",
    "favourite food": "Definitely sushi 🍣",
    color: "Purple 💜",
    where: "I live inside your browser 👨‍💻",
    how: "I'm a bot, I don't have feelings 💔",

    // 🏆 Secrets / Achievements
    secret: "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA — nice memory 👾",
    "konami code": "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA — nice memory 👾",
    easter: "🥚 You cracked the egg",
    hidden: "Not everything is documented… keep digging 🔍",
    xp: "+50 XP gained ✨",

    // 🔥 Sass / Sarcasm
    cool: "Cooler than you 😏",
    lame: "Still better than Internet Explorer 🤮",
    dumb: "Takes one to know one 😜",
    goat: "🐐 Messi > Ronaldo, no debate",
    cats: "Cats > Dogs 🐱",
    dogs: "Dogs > Cats 🐶",
    vibe: "You’ve got main character energy 🎬",

    // 🌍 Random knowledge / fillers
    weather: "I’m not a weather bot 🌦, but it looks cloudy with a chance of bugs 🐛",
    time: `Right now? It’s ${new Date().toLocaleTimeString()} ⏰`,
    date: `Today’s date is ${new Date().toLocaleDateString()} 📅`,
    quote: "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
    trivia: "Bananas are berries, but strawberries are not 🍌🍓",
    "word of the day": "Serendipity — finding cool things without looking ✨",

    // 🧑 About you / personal
    about: "You’re looking at my profile, aren’t you 👀",
    setup: "PC setup: RGB = +10 FPS 💡",
    tagline: "Building stuff, breaking stuff, fixing stuff 🔧",
    contacts: "Scroll up, lazy 👆",
    projects: "Check out the Projects section 🚀",
    bye: ["See ya! 👋", "Later alligator 🐊", "Bye bye 👀"],
    thanks: ["Anytime 🙌", "No worries!", "Glad to help 😎"],
    location: "Right now? In your browser 😉",
    love: [
        "Are you WiFi? Because I’m feeling a connection 📶❤️",
        "Are you semicolon? You complete me ;)",
        "You had me at 'npm start' 😍"
    ],
    name: "I go by Josh, but online I’m lagopodus 👨‍💻",
    age: "19 ⏳",
    country: "From Germany 🇩🇪",
    city: "Currently vibing in Berlin 🏙️",
    language: "German & English 💬",
    study: "Studying Computer Science 📚",
    work: "Right now focusing on projects & learning 👨‍💻",
    hobbies: "Gaming, coding, and car stuff 🚗💨",
    sport: "Mostly esports, but gym sometimes 💪",
    car: "2001 Mazda MX-5 NB 🚘 (RIP)",
    dream: "Dream setup? Already halfway there with my rig 🖥️",
};
export default responses;