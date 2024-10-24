
function forward(searchTerm) {
    let a = document.createElement("a")
    a.href = `books.html?q=${searchTerm}&page_number=1`
    a.click()
}



window.onload = (ev) => {
    // console.log("on book")
    const urlParams = new URLSearchParams(window.location.search);
    init(urlParams.get("id"), urlParams.get("type"))

    // this is nedded to work navbar search bar
    // if (urlParams.get("q") != null && urlParams.get("q") !== "") {
    //     init()
    // } else {
    //     document.getElementById("loadingScreen").style.display = "none"
    //     document.getElementById("not_found").classList.remove("hidden")
    // }

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Perform your search functionality here
        const searchTerm = document.getElementById('searchInput').value;
        if (searchTerm.trim().length === 0) {
            // console.log("length === 0")
        } else {
            localStorage.setItem("search", searchTerm)
        }
        searchTerm.replaceAll(" ", "+")
        forward(searchTerm)

    })

}



function handleArchiveJson(volumeInfo, id) {
    // https://archive.org//download/mpw-c-language/mpw%20c%20language.pdf
    let authorName = volumeInfo["metadata"]["uploader"]
    let bookTitle = volumeInfo["metadata"]["title"]
    let description = volumeInfo["metadata"]["description"]
    let pageCount = volumeInfo["pageCount"]
    let publishedTime = volumeInfo["metadata"]["date"]
    let image = volumeInfo["files"][0]["name"]
    document.getElementById("previewImage").src = `https://archive.org/download/${id}/${image}`
    document.getElementById("bookTitle").textContent = `${bookTitle}`
    document.getElementById("authorTitle").textContent = `${authorName}`
    document.getElementById("descriptionContainer").innerHTML = `${description}`
    document.getElementById("pageNumber").textContent = `Page: ${pageCount}`
    document.getElementById("publicationDate").textContent = `PublicationDate: ${publishedTime}`

    document.getElementById("type").textContent = "Type: Ebook"

    let downloadLink = null
    for (let i = 0; i < volumeInfo["files"].length; i++) {
        downloadLink = volumeInfo["files"][i]["name"]
        let isPrivate = volumeInfo["files"][i]["private"]
        if (isPrivate === undefined) {
            isPrivate = false
        }
        // console.log(isPrivate)
        if (downloadLink.includes(".pdf") && !isPrivate && !downloadLink.includes("encrypted")) {
            // console.log(`download link: ${downloadLink}`)
            break
        }
        downloadLink = null
        // console.log("download link in archive: "+ downloadLink)
    }
    let button = document.getElementById("freeSample");
    
    if (downloadLink === null) {
        button.classList.add("btn-secondary")
        button.disabled = true; 
    }

    button.addEventListener("click", (ev) => {
        let a = document.createElement("a")
        a.target = "_blank"
        a.href = `https://archive.org/download/${id}/${downloadLink}`
        a.click()
    })

    if (downloadLink === null) {
        document.getElementById("freeSample").innerText = "Not available"
        // console.log("not ava")
    } else {
        document.getElementById("freeSample").innerText = "Free Download"
    }
 }
function handleJson(r, id) {
    let volumeInfo = r["volumeInfo"]
    let authorName = volumeInfo["authors"]
    let bookTitle = volumeInfo["title"]
    let subTitle = volumeInfo["subtitle"]
    let description = volumeInfo["description"]
    let pageCount = volumeInfo["pageCount"]
    let isEbook = volumeInfo["isEbook"]
    let publishedTime = volumeInfo["publishedDate"]
    document.getElementById("previewImage").src = `https://books.google.com/books/publisher/content/images/frontcover/${id}?fife=w480-h690`
    document.getElementById("bookTitle").textContent = `${bookTitle}: ${subTitle}`
    document.getElementById("authorTitle").textContent = `${authorName.toString()}`
    document.getElementById("descriptionContainer").innerHTML = `${description}`
    document.getElementById("pageNumber").textContent = `Page: ${pageCount}`
    document.getElementById("publicationDate").textContent = `PublicationDate: ${publishedTime}`
    if (isEbook === true) {
        document.getElementById("type").textContent = "Type: Ebook"
    } else {
        document.getElementById("type").textContent = "Type: Book"
    }



 }

 function init(id, type) {
     if (type === "google") {
         initGoogle(id)
     } else {
         initArchive(id)
     }

 }

 function initArchive(id) {
     fetch(`https://archive.org/metadata/${id}`)
         .then(response => {
             response.json().then(r => {
                // console.log(r)
                 handleArchiveJson(r, id)
             })
         })

     document.getElementById("buyBook").style.display = "none"
 }

function initGoogle(id) {
    // console.log("init called")
    // let id = localStorage.getItem("id")
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then(response => {
            response.json().then(r => {
                handleJson(r, id)
            })
        })
    document.getElementById("freeSample").addEventListener("click", (ev) => {
        let a = document.createElement("a")
        a.target = "_blank"
        a.href = `https://play.google.com/books/reader?id=${id}&pg=GBS.PR3&hl=en_GB`
        a.click()
    })

    document.getElementById("buyBook").addEventListener("click", (ev) => {
        let a = document.createElement("a")
        a.target = "_blank"
        a.href = `https://play.google.com/store/books/details?id=${id}&rdid=book-${id}&rdot=1&source=gbs_api"`
        a.click()
    })
}