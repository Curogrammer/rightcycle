const pages=document.querySelectorAll("[data-page]");function changePage(e){pages.forEach(e=>{e.style.display="none"}),document.querySelector(`[data-page="${e}"]`).style.display="flex",document.querySelector(`[data-page="${e}"]`).style.flexDirection="column",history.pushState({}, '')}