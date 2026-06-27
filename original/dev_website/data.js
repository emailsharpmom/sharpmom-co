const appData = {
    business: {
        phone: "000-000-0000", // Replace with real number
        displayPhone: "(000) 000-0000"
    },
    // SOURCE OF TRUTH FOR ROUTE LOGIC
    zipRouteMap: {
        // Week 1 - Monday
        "95008": { routeDay: "Monday", week: 1 },
        "95124": { routeDay: "Monday", week: 1 },
        "95118": { routeDay: "Monday", week: 1 },
        // Week 1 - Tuesday
        "95125": { routeDay: "Tuesday", week: 1 },
        "95126": { routeDay: "Tuesday", week: 1 },
        // Week 1 - Wednesday
        "95050": { routeDay: "Wednesday", week: 1 },
        "95051": { routeDay: "Wednesday", week: 1 },
        "95014": { routeDay: "Wednesday", week: 1 },
        "95129": { routeDay: "Wednesday", week: 1 },
        // Week 1 - Thursday
        "94085": { routeDay: "Thursday", week: 1 },
        "94086": { routeDay: "Thursday", week: 1 },
        "94087": { routeDay: "Thursday", week: 1 },
        // Week 1 - Friday
        "94040": { routeDay: "Friday", week: 1 },
        "94041": { routeDay: "Friday", week: 1 },
        "94022": { routeDay: "Friday", week: 1 },
        "94024": { routeDay: "Friday", week: 1 },
        // Week 1 - Saturday
        "94301": { routeDay: "Saturday", week: 1 },
        "94303": { routeDay: "Saturday", week: 1 },
        "94304": { routeDay: "Saturday", week: 1 },
        "94306": { routeDay: "Saturday", week: 1 },
        // Week 2 - Monday
        "95120": { routeDay: "Monday", week: 2 },
        // Week 2 - Tuesday
        "95135": { routeDay: "Tuesday", week: 2 },
        "95138": { routeDay: "Tuesday", week: 2 }
    },
    services: [
        { icon: "ph-knife", text: "Flat-edge or serrated<br>Same flat price" },
        { icon: "ph-warning-octagon", text: "No extra charge for<br>chip & tip repairs" },
        { icon: "ph-hand-heart", text: "Free personalized<br>knife-care tips" },
        { icon: "ph-truck", text: "Convenient route-based<br>pickup and delivery" }
    ],
    pricing: [
        { icon: "ph-knife", label: "All Knives<br>(including cleavers)", price: "$15" },
        { icon: "ph-knife", label: "Paring Knives<br>(6in. or less)", price: "$12", scale: 0.8 },
        { icon: "ph-swatches", label: "Pocket Knives", price: "$10" },
        { icon: "ph-scissors", label: "Scissors", price: "$12" },
        { icon: "ph-clover", label: "Garden Pruners and Loppers", price: "$15–$25" },
        { icon: "ph-leaf", label: "Mower Blades (free removal)", price: "$20" }
    ],
    results: [
        { src: "images/result-1.jpg", caption: "Japanese Misono Knife Restoration" },
        { src: "images/result-2.jpg", caption: "Chip Repair" },
        // Ensure you have a result-3.jpg in your folder or remove this line
        { src: "images/result-1.jpg", caption: "Before and after sharpening" } 
    ],
    reviews: [
        {
            name: "Mu Seo.", source: "Google", stars: 5,
            text: `Very thorough service. I instantly became a fan. My kitchen knife is a very sentimental gift from my mom... Highly recommended!`
        },
        {
            name: "Margaret K. T.", source: "Google", stars: 5,
            text: `Chaitra is a magician. She fixed a tip I thought was gone forever. Highly recommend!`
        },
        { name: "Jane Cho", source: "Google", stars: 5, text: "Love Chaitra did a great job sharpening my kitchen knives. They were getting dull, and now they are so sharp and smooth." },
        { name: "Shanti Natraj", source: "Google", stars: 5, text: "Excellent sharpness. The knives and the scissors are now in great condition." }
    ],
    messages: {
        doorstepBooking: "Hi Sharp Mom! I'd like to book a House Call ($100 min). I have about [NUMBER] items.",
        routeBooking: "Hi Sharp Mom! I'm in [ZIP CODE] and saw you are coming on [DATE]. I'd like to book a route pickup ($35 min)."
    },
    socials: {
        google: "https://share.google/Eu1Lw4jgYudZOqofF",
        nextdoor: "https://nextdoor.com/page/the-sharp-stop-santa-clara-ca/",
        instagram: "https://www.instagram.com/sharpmomco/"
    }
};