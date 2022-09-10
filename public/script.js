  $(document).ready(function() {
      $("#kisalt").click(async function() {

        const url = $("#url")[0].value;

        const istenenZaman = $("#sifreSKT")[0].value; //1 - 2

        const zamanSecim = ($("#zamanSecim")[0])[$("#zamanSecim")[0].selectedIndex].value; //day - min 

        const zaman = istenenZaman + zamanSecim;

        const json = {
          url,
          expires: zaman
        }
        
        const a = await fetch(`/yeni`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(json)
        });

        const b = await a.json();

        if (!b.success) return alert(b.message);

        $("#kisaLink")[0].textContent = location.origin + "/" + b.message.kisaLink;
        $("#btnKopyala")[0].hidden = false
        
      })

    $("#btnKopyala").click(async function() {
      await navigator.clipboard.writeText($("#kisaLink")[0].textContent);
    
      alert("Kopyalandı!");
    })
  })