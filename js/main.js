
//hero section :
const hero =document.querySelector('#hero-section');
hero.style.backgroundImage = "url('./images/Backgroun_hero.png')";




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
            x.className='flex flex-col items-center gap-4'
          const response = await fetch(urlx);
          const data = await response.json();

          //crete element in dom
          data.results.forEach(elm=>{
              const card =document.createElement('div');
              card.className='max-w-[281px] xsm:max-w-[331px] flex flex-col  rounded-[16px] shadow-md hover:scale-[1.05] transition-transform border border-gray-600  p-5 hover:shadow-[0px_0px_12px_rgba(151,173,172,0.210)] ';
                
          card.innerHTML = ` <span class='text-end pb-4'><i class="fa-regular fa-heart text-gray-400 "></i></span>
                             <div class="w-full h-40">
                                
                               <img src="${elm.background_image}" alt="${elm.name}" class="w-full h-full object-cover rounded min-w-[240px] xsm:min-w-[440px] ">
                            </div>

                            <div class="p-3">
                                  <h3 class="text-sm font-semibold text-white truncate">${elm.name}</h3>
                        
                                  <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                                    <span> ⨂ ${elm.rating }</span>
                                    
                                  </div>
                            </div> `;
                x.appendChild(card);
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

//focus in input shearch 

document.querySelector('#inp_shearch').addEventListener('focus',()=>{
         document.querySelector('#div_shearch').classList.add('div_input_focus');
})

document.querySelector('#inp_shearch').addEventListener('blur',()=>{
         document.querySelector('#div_shearch').classList.remove('div_input_focus');
})

//get valeu input 

let url_search ;
let valeu_input;
document.querySelector('#inp_shearch').addEventListener('input',(e)=>{     
      valeu_input= e.target.value;
      url_search= `https://debuggers-games-api.duckdns.org/api/games?page=1&limit=20&search=${valeu_input}`;
})

document.querySelector('#button_search').addEventListener('click',()=>{         
       Array.from(x.children).forEach(node=>{
                node.remove();
        }) 
        getData(url_search);  
})


 