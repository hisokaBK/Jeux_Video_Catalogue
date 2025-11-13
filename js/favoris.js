let localData=JSON.parse(localStorage.getItem('likes'));

const  fav_continer =document.querySelector("#fav_continer");
fav_continer.classList='grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 xl:lg:grid-cols-4   gap-4 xl:gap-[14px] '

localData.forEach(elm=>{
             const card =document.createElement('div');
              card.className='max-w-[87%] flex flex-col  rounded-[16px] shadow-md hover:scale-[1.05] transition-transform border border-gray-600  p-5 hover:shadow-[0px_0px_12px_rgba(151,173,172,0.210)] sm:max-w-[431px]  md:max-w-[341px] lg:max-w-[281px] justify-self-center';

             card.innerHTML = `<span class='text-end pb-4'>
                                   <i onclick="removeFavorites('${elm.id}')" class="text-[#9006ac9d]  hover:text-gray-400  fa-solid fa-heart"></i>
                               </span>

                             <div class="w-full h-40">
                               <img src="${elm.img}" alt="${elm.name}" class="w-full h-full object-cover rounded  min-w-[280px] max-w-[280px] sm:min-w-[340px] md:min-w-[300px] lg:min-w-[240px]">
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
                fav_continer.appendChild(card);
})


function removeFavorites(id){
              localData=localData.filter(like=>like.id!=id);
              localStorage.setItem('likes',JSON.stringify(localData));
              window.location.reload();
}