const appData = {
    business: {
        phone: "000-000-0000", // Dummy number for testing
        displayPhone: "(000) 000-0000"
    },
    services: [
        { icon: "ph-knife", text: "Flat-edge or serrated<br>Same flat price" },
        { icon: "ph-warning-octagon", text: "No extra charge for<br>chip & tip repairs" },
        { icon: "ph-hand-heart", text: "Free personalized<br>knife-care tips" },
        { icon: "ph-arrows-clockwise", text: "Subscribe and save on every visit" }
    ],
    pricing: [
        { icon: "ph-knife", label: "All Knives<br>(including cleavers)<br>", price: "$15" },
        { icon: "ph-knife", label: "Paring Knives<br>(6in. or less)<br>", price: "$12", scale: 0.8 },
        { icon: "ph-swatches", label: "Pocket Knives<br>", price: "$10" },
        { icon: "ph-scissors", label: "Scissors", price: "$12" },
        { icon: "ph-clover", label: "Garden Pruners and Loppers<br>", price: "$15–$25" },
        { icon: "ph-leaf", label: "Mower Blades (free removal)<br>", price: "$20" }
    ],
    markets: [
        { name: "Campbell Farmers Market", time: "Sunday, 9am - 1pm", location: "Downtown Campbell" },
        { name: "Saratoga Farmers Market", time: "Saturday, 9am - 1pm", location: "West Valley College" },
        { name: "Los Gatos Farmers Market", time: "Sunday, 9am - 1pm", location: "Town Plaza Park" }
    ],
    results: [
        { src: "images/result-1.jpg", caption: "Japanese Misono Knife Restoration" },
        { src: "images/result-2.jpg", caption: "Chip Repair" },
        { src: "images/result-3.jpg", caption: "Before and after sharpening" }
    ],
    reviews: [
        {
            name: "Mu Seo.", source: "Google", stars: 5,
            text: `Very thorough service. I instantly became a fan. My kitchen knife is a very sentimental gift from my mom, and I didn’t want to just take it to anywhere. I am beyond 100% impressed with the high quality knife sharpening service of South Bay Sharp Stop and best of all, I appreciated the outstanding professional communication throughout the process. Highly recommended!
            My knives are sharper than when I bought them! The contactless service was so easy.`
        },
        {
            name: "Margaret K. T.", source: "Google", stars: 5,
            text: `Chaitra is a magician. She fixed Wowwwww!!! I don't know if my knives were even this sharp when they were brand new!
            The owner does outstanding work. She works promptly and is quick to communicate/answer questions. I absolutely recommend her sharpening service.
            Get your knives sharpened, people! You won't believe the difference. tip I thought was gone forever. Highly recommend!`
        },
        { name: "Jane Cho", source: "Google", stars: 5, text: "Love Chaitra did a great job sharpening my kitchen knives. They were getting dull, and now they are so sharp and smooth. Thank you, Chaitra!" },
        { name: "Shanti Natraj", source: "Google", stars: 5, text: "Excellent sharpness. The knives and the scissors are now in great condition. I have been using the knives for cutting veggies and they cut thro so smoothly. The scissors cut several layers of fabric seamlessly. Highly recommend for the love of your favorite tools to be sharpened👍🏽" }
    ],
    messages: {
        doorstepBooking: "Hi Sharp Mom! I'd like to book a doorstep sharpening. I have about [NUMBER] items."
    },
    socials: {
        google: "https://share.google/Eu1Lw4jgYudZOqofF",
        nextdoor: "https://nextdoor.com/page/the-sharp-stop-santa-clara-ca/", // Removed trailing period
        instagram: "https://www.instagram.com/sharpmomco/"
    }
};