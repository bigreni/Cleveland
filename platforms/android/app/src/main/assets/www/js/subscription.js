var products = ["proversion", "pro_biannual", "pro_annual"];
var owned = localStorage.getItem("proVersion");
var productId = localStorage.getItem("productId");
var platformType;

function loadProducts()
{
    // CdvPurchase.store.register([{
    //     type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
    //     id: 'test-subscription',
    //     platform: CdvPurchase.Platform.TEST,
    //   }]);
 
    if (/(android)/i.test(navigator.userAgent)){
        platformType = CdvPurchase.Platform.GOOGLE_PLAY;
    }
    else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        platformType = CdvPurchase.Platform.APPLE_APPSTORE;
    }
    else{
        platformType = CdvPurchase.Platform.TEST;
    }
    CdvPurchase.store.register([{
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'proversion',
        platform: platformType,
        },
        {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'pro_biannual',
        platform: platformType,
        },
        {
        type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
        id: 'pro_annual',
        platform: platformType,
        }]); 
        CdvPurchase.store.restorePurchases();
        CdvPurchase.store.when().productUpdated(onProductUpdated);
        CdvPurchase.store.when().approved(onTransactionApproved);
    //   CdvPurchase.store.initialize([CdvPurchase.Platform.TEST]);
        CdvPurchase.store.initialize([platformType]);
    }

function onProductUpdated() {
    // const product = CdvPurchase.store.get('test-subscription', CdvPurchase.Platform.TEST);
    document.getElementById("plans").innerHTML = "";
    var text = '';
    for (i = 0; i < products.length; i++) {
        const product = CdvPurchase.store.get(products[i], platformType);
         if(product != null)
        {
            if(isProductOwned(product))
            {
                localStorage.proVersion = 1;
                localStorage.productId = product.id;
            }
                // text += '<h4 style="text-align:center;"><button onclick=buy("' + product.id + '"); class="premium">' + product.title + ' - ' + product.pricing.price + '</button></h4>';
            // alert(text);
            text += '<ul class="pricingTable-firstTable"><li class="pricingTable-firstTable_table"><h1 class="pricingTable-firstTable_table__header">' + product.title + '</h1>';
            text += '<p class="pricingTable-firstTable_table__pricing">' + product.pricing.price +'</p>';
            text += '<p class="pricingTable-firstTable_table__pricing">' + product.description +'</p>';
            text += '<button class="pricingTable-firstTable_table__getstart" onclick=buy("' + product.id + '");>Subscribe</button>';
            text += '</ul>';      
        }
    }
    //if(productId != null && owned == 1)
    //    text += '<p> You are currently subscribed to the ' + productId + ' plan. Thank you for your support.</p>';
    $("#plans").append(text);
}

  function onTransactionApproved(transaction)
  {
    //document.getElementById("plans").innerHTML = "";
    if(transaction.products[0].id != 'com.cleveland.withads')
    {
        if(owned == null || owned == 0)
        {
            var text = '<label>Thank you for subscribing to our app and supporting us.</label><br>'
            $("#plans").append(text);
            localStorage.proVersion = 1;
            localStorage.productId = transaction.products[0].id;
            transaction.finish();
            //window.location = "index.html";
        }
    }

  }

  function buy(id) {
    // alert(id);
    const product = CdvPurchase.store.get(id, platformType);
    const offer = product.getOffer();
    if (offer)
      offer.order();
  }

  function isProductOwned(product)
  {
    return product.owned;
  }
