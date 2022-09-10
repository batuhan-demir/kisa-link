const loki = require('lokijs');
const ms = require('ms');

const db = new loki("Veritabani", { autosave: true });

let linkler;

db.loadDatabase({}, () => {
    linkler = db.getCollection("linkler");

    if (linkler.data) console.log(`Linkler Yüklendi: ${linkler.data.length} Link`)

});

linkler ||= db.addCollection("linkler");


module.exports = {

    linkEkle: ({ url, expires }) => {

        if (!validURL(url))
            return {
                success: false,
                satatus: 400,
                message: "Link Geçersiz"
            };

        if (expires && !ms(expires) || ms(expires) > ms("30d"))
            return {
                success: false,
                satatus: 400,
                message: "Geçersiz Süre Biçimi (En fazla 30 gün olabilir)"
            }

        const kisaLink = Math.random().toString(36).substring(2, 15);

        while (linkler.find({ kisaLink }).length > 0) { }

        return {
            success: true,

            message: linkler.insert({
                url,
                kisaLink,
                expires: expires ? expires : undefined
            })
        }

    },

    linkBul: (kisaLink) => {

        let link = linkler.findOne({ kisaLink });

        if (!link)
            return {
                success: false,
                status: 404,
                message: "Link Bulunamadı."
            }


        if (link.expires && (new Date(link.meta.created + ms(link.expires))) < new Date(Date.now()))
            return {
                success: false,
                status: 404,
                message: "Linkin Süresi Dolmuş."
            }

        link.url = link.url.includes('http') ? link.url : "http://" + link.url;

        return {
            success: true,
            message: link
        }

    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}