const x =document.querySelector('#x');
let url="https://debuggers-games-api.duckdns.org/api/games?page=1&limit=20";

const next =document.querySelector("#next");

// pour sauvegarder le next url
let result ;
let isload;

async function getData(urlx){
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML='<div class="lds-facebook"><div></div><div></div><div></div></div>'
            
            loadingDiv.classList.add('loading');
            x.appendChild(loadingDiv);
          const response = await fetch(urlx);
          const data = await response.json();

          //crete element in dom
            data.results.forEach(elm=>{
              const div =document.createElement('div');
              const img =document.createElement('img')
              img.src=`${elm.background_image}`;
              div.appendChild(img);
              x.appendChild(div);
            })

            result=data.next;

            loadingDiv.remove();
}

getData(url);

next.addEventListener('click',()=>{

     getData(result);
           
})


 