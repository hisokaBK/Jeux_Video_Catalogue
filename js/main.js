//jib data li localStorage
let localData=JSON.parse(localStorage.getItem('likes'));


//hero section :
const hero =document.querySelector('#hero-section');
hero.style.backgroundImage = "url('./images/Background.png')";

//cart continer
const x =document.querySelector('#x');
let url="https://debuggers-games-api.duckdns.org/api/games?page=1&limit=20";

const next =document.querySelector("#next");

// pour sauvegarder le next url
let result ;
//bach maw9a3ch lodin o loeding l2asli kayn
let isload=0;

async function getData(urlx){
          //f7alat loading ba9i ki loadi
          if(isload===1){
              return ;
          }
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML='<div class="loadings"><div></div><div></div><div></div></div>'

            isload=1;

            loadingDiv.classList.add('loading');
            x.appendChild(loadingDiv);
            x.className='grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 xl:lg:grid-cols-4   gap-4 xl:gap-[14px] '
            const response = await fetch(urlx);
            const data = await response.json();

          //crete element in dom
          data.results.forEach(elm=>{
              const card =document.createElement('div');
              card.className='max-w-[87%] flex flex-col  rounded-[16px] shadow-md hover:scale-[1.05] transition-transform border border-gray-600  p-5 hover:shadow-[0px_0px_12px_rgba(151,173,172,0.210)] sm:max-w-[431px]  md:max-w-[341px] lg:max-w-[281px] justify-self-center';
                
          card.innerHTML = `<span class='text-end pb-4'><i onclick="addFavorites(this,'${elm.id}','${elm.name}','${elm.rating}','${elm.updated}')" data-like="noLiked" class="fa-regular fa-heart text-gray-400 hover:text-[#9006ac9d] "></i></span>
                             <div class="w-full h-40">
                               <img src="${elm.background_image}" alt="${elm.name}" class="w-full h-full object-cover rounded  min-w-[280px] max-w-[280px] sm:min-w-[340px] md:min-w-[300px] lg:min-w-[240px]">
                            </div>

                            <div class="p-3">
                                  <h3 class="text-sm  sm:text-[18px] font-semibold text-white truncate">${elm.name}</h3>
                        
                                  <div class="mt-[8px] flex items-center justify-between text-xs text-gray-500">
                                    <span> ⨂ ${elm.rating }</span>
                                  </div>
                                   <div class="mt-[18px] flex items-center justify-between text-xs text-gray-500">
                                        <span class="text-gray-300">updated : </span> 
                                        <span>${elm.updated }</span>
                                    </div>
                            </div> `;
                x.appendChild(card);
            })

             isload=0;
             if(data.results.length>=20){
                 next.style.display='flex';
             }else{
                 next.style.display='none';
             }
  

          //hna kanchof wach list 3ara wla la , 3la 9ibal search
            if(data.results.length<=0){
                     let ndiv =document.createElement('div');
                     ndiv.innerHTML=`
                          <div class="flex justify-center w-screen"><img class="h-52 sm:h-80" src='./images/not_fond.png'></div>
                     `
                     x.appendChild(ndiv);
            } 
            
            result=data.next;
            loadingDiv.remove();
            
}

getData(url);

//onclick add mor 20 cart
next.addEventListener('click',()=>{
     if(result==null){
         next.style.display='none';
     }
     getData(result);   
})

//focus in input shearch 

document.querySelector('#inp_shearch').addEventListener('focus',()=>{
         document.querySelector('#div_shearch').classList.add('div_input_focus');
         document.querySelector('#img-log').classList.add("img_log");
})


//get valeu input 

let url_search ;
let valeu_input='';
document.querySelector('#inp_shearch').addEventListener('input',(e)=>{     
      valeu_input= e.target.value;
      url_search= `https://debuggers-games-api.duckdns.org/api/games?page=1&limit=20&search=${valeu_input}`;
})

document.querySelector('#inp_shearch').addEventListener('blur',()=>{ 
        document.querySelector('#div_shearch').classList.remove('div_input_focus');  
        if(valeu_input==''){
              return;
        }else{
               Array.from(x.children).forEach(node=>{
                 node.remove();
                }) 

                getData(url_search);                
                 
        }
        
})


/*favorit*/


function addFavorites(element,id,name,rating,updated){
         localData=JSON.parse(localStorage.getItem('likes'));

         if(element.dataset.like=='noLiked'){
              for(let i=0;i<localData.length;i++){
                      if(id==localData[i].id){
                       console.log('fgdhyhcujljkvhch');
                       return;
                   }
              }

            
              element.parentNode.innerHTML=`<i onclick="addFavorites(this,'${id}','${name}','${rating}','${updated}')" class="text-[#9006ac9d]  hover:text-gray-400  fa-solid fa-heart"></i>`;

                console.log( id );

              element.dataset.like='like';
              localData=[...localData,{'id':id,'name':name,'rating':rating,'updated':updated}];
              localStorage.setItem('likes',JSON.stringify(localData));

         }else{
              element.parentNode.innerHTML=`<i onclick="addFavorites(this,'${id}','${name}','${rating}','${updated}')" data-like="noLiked" class="fa-regular fa-heart text-gray-400 hover:text-[#9006ac9d] "></i>`;
              element.dataset.like='noLike';
              localData=localData.filter(like=>like.id!=id);
              localStorage.setItem('likes',JSON.stringify(localData));
         }
}

