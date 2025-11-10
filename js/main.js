const x =document.querySelector('#x');
let url="https://debuggers-games-api.duckdns.org/api/games?page=1&limit=20";

const next =document.querySelector("#next");

// pour sauvegarder le next url
let result ;
//bach maw9a3ch lodin o loeding l2asli kayn
let isload=0;

async function getData(urlx){
          if(isload===1){
              return ;
          }
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML='<div class="lds-facebook"><div></div><div></div><div></div></div>'

            isload=1;

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
            isload=0;
}

getData(url);

//onclick add mor 20 cart
next.addEventListener('click',()=>{
     getData(result);   
})


 