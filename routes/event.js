var express = require('express');
var router = express.Router();

router.get('/bread-and-circuses', function(req, res, next) {
    res.render('event', {
        title: "Bread and Circuses - Kaafila",
        cssID: 'event-bnc',
        headerFont: 'rye',
        bannerName: "bread-and-circuses",
        eventCategories: [
            {
                name: "Competitive Events",
                main: [
                    {image: "/img/banners/bnc-mm-banner.png", link:"/bread-and-circuses/monologue-maestros"},
                    {image: "/img/banners/bnc-oap-banner.png", link:"/bread-and-circuses/one-act-play"}
                ]
            }
        ],
        active_bnc: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/folk-fluence', function(req, res, next) {
    res.render('event', {
        title: "Folk Fluence - Kaafila",
        header: 'Folk Fluence',
        cssID: 'event-ff',
        headerFont: 'ardagh',
        bannerName: "folk-fluence",
        eventCategories: [
            {
                name: "Competitive Events",
                main: [
                    {image: "/img/banners/ff-ff-banner.png", link:"/folk-fluence/folk-fluence"}
                ]
            }
        ],
        active_ff: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/iridescence', function(req, res, next) {
    res.render('event', {
        title: "Iridescence - Kaafila",
        header: 'Iridescence',
        cssID: 'event-i',
        headerFont: 'apple-garamond',
        bannerName: "iridescence",
        eventCategories: [
            {
                name: "Competitive Events",
                main: [
                    {image: "/img/banners/i-sof-banner.png", link:"/iridescence/spirit-of-freedom"}
                ]
            }
        ],
        active_i: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/strings-attached', function(req, res, next) {
    res.render('event', {
        title: "Strings Attached - Kaafila",
        header: 'Strings Attached',
        cssID: 'event-sa',
        headerFont: 'welcome',
        bannerName: "strings-attached",
        eventCategories: [
            {
                name: "Competitive Events",
                main: [
                    {image: "/img/banners/sa-sas-banner.png", link:"/strings-attached/strings-attached-solos"},
                ]
            },
            {
                name: "Collaborative Events",
                main: [
                    {image: "/img/banners/sa-sff-banner.png", link:"/strings-attached/songs-for-freedom"}
                ]
            }
        ],
        active_sa: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});


router.get('/bread-and-circuses/monologue-maestros', function(req, res, next) {
    res.render('subevent', {
        title: "Monologue Maestros - Bread and Circuses - Kaafila",
        subeventName: "Monologue Maestros",
        subeventImage: "/img/banners/bnc-mm-banner.png",
        active_bnc: true,
        bnc_mm: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/bread-and-circuses/one-act-play', function(req, res, next) {
    res.render('subevent', {
        title: "One Act Play - Bread and Circuses - Kaafila",
        subeventName: "One Act Play",
        subeventImage: "/img/banners/bnc-oap-banner.png",
        active_bnc: true,
        bnc_oap: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

router.get('/folk-fluence/folk-fluence', function(req, res, next) {
    res.render('subevent', {
        title: "Folk Fluence - Folk Fluence - Kaafila",
        subeventName: "Folk Fluence",
        subeventImage: "/img/banners/ff-ff-banner.png",
        active_ff: true,
        ff_ff: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

router.get('/iridescence/spirit-of-freedom', function(req, res, next) {
    res.render('subevent', {
        title: "Spirit of Freedom - Iridescence - Kaafila",
        subeventName: "Spirit of Freedom",
        subeventImage: "/img/banners/i-sof-banner.png",
        active_i: true,
        i_sof: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

router.get('/strings-attached/strings-attached-solos', function(req, res, next) {
    res.render('subevent', {
        title: "Strings Attached Solos - Strings Attached - Kaafila",
        subeventName: "Strings Attached Solos",
        subeventImage: "/img/banners/sa-sas-banner.png",
        active_sa: true,
        sa_sas: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/strings-attached/songs-for-freedom', function(req, res, next) {
    res.render('subevent', {
        title: "Songs for Freedom - Strings Attached - Kaafila",
        subeventName: "Songs for Freedom",
        subeventImage: "/img/banners/sa-sff-banner.png",
        active_sa: true,
        sa_sff: true,
        styles: [
            '/css/fonts.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

module.exports = router;
