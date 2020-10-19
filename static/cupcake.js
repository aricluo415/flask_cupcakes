$cupcake_list = $('#cupcake-list');
$add_cupcake = $('#add-cupcake-form');

async function getCupcakes() {
    console.log('hello')
    response = await axios.get("http://127.0.0.1:5000/api/cupcakes")

    cupcakes = response.data.cupcakes;
    $cupcake_list.empty();
    for (let cupcake of cupcakes) {
        generateMarkdown(cupcake);
    }
}

function generateMarkdown(cupcake) {
    $cupcake_list.append(`
            <li class="card mb-3" id="${cupcake.id}">
                <div class= "row">
                    <img class="card-img-left col-4 img-url" src="${cupcake.image}" alt="Card image cap">
                    <div class="card-body col-8">
                        <h5 class="card-title flavor">${cupcake.flavor}</h5>
                        <p class="card-text rating">Rating:${cupcake.rating}</p>
                        <p class="card-text size">Size:${cupcake.size}</p>
                        <button class="btn btn-danger delete-cupcake">Delete</button>
                        <button class="btn btn-secondary edit-cupcake">Edit</button>
                        
                    </div>
                </div>
                <form class="col-sm-3 edit-cupcake-form collapse">
                    <div class="form-group">
                        <label for="flavor">Flavor</label>
                        <input type="text" class="form-control" id="flavor-${cupcake.id}" placeholder="Vanilla">
                    </div>
                    <div class="form-group">
                        <label for="rating">Rating</label>
                        <input type="text" class="form-control" id="rating-${cupcake.id}" placeholder="1">
                        <small id="ratingHelp" class="form-text text-muted">Rate 1-10</small>
                    </div>
                    <div class="form-group">
                        <label for="size">Size</label>
                        <select class="form-control" id="size-${cupcake.id}">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="img-url">Image</label>
                        <input type="url" class="form-control" id="img-url-${cupcake.id}">
                    </div>
                    <button class="btn btn-primary submit-edit">Submit</button>
                </form>
            </li>    
        `)
}
async function handleSubmit(evt) {
    evt.preventDefault();
    console.log("HELLO")
    let cupcake = {
        "flavor": $("#flavor").val(),
        "rating": parseInt($("#rating").val()),
        "size": $("#size").val(),
        "image": $("#img-url").val(),
    }

    response = await axios.post('/api/cupcakes', cupcake = cupcake);
    console.log(response.status)
    if (response.status === 201) {
        generateMarkdown(response.data.cupcake)
    }
}
async function handleDelete(evt) {
    let cupcake_id = $(evt.target).closest("li").attr("id");
    response = await axios.delete(`/api/cupcakes/${cupcake_id}`);
    if (response.status = 200) {
        $cupcake_list.children(`#${cupcake_id}`).remove();
    }
}
async function showEdit(evt) {
    let cupcake_id = $(evt.target).closest("li").attr("id");
    $(evt.target).closest("li").children("form").toggle();
    console.log(cupcake_id)

}

async function handleEdit(evt) {
    evt.preventDefault();
    let cupcake_id = $(evt.target).closest("li").attr("id");
    $(evt.target).closest("li").children("form").toggle();
    let cupcake = {
        "flavor": $(`#flavor-${cupcake_id}`).val(),
        "rating": parseInt($(`#rating-${cupcake_id}`).val()),
        "size": $(`#size-${cupcake_id}`).val(),
        "image": $(`#img-url-${cupcake_id}`).val(),
    }
    console.log(cupcake)
    response = await axios.patch(`/api/cupcakes/${cupcake_id}`, cupcake = cupcake);
    if (response.status = 200) {
        console.log($(`#${cupcake_id}`).find('.flavor'))
        $(`#${cupcake_id}`).find('.flavor').text(response.data.cupcake.flavor);
        $(`#${cupcake_id}`).find('.rating').text(response.data.cupcake.rating);
        $(`#${cupcake_id}`).find('.size').text(response.data.cupcake.size);
        $(`#${cupcake_id}`).find('.img-url').attr("src", (response.data.cupcake.img_url));
    }
}

$add_cupcake.on("submit", evt => handleSubmit(evt));
$cupcake_list.on("click", ".delete-cupcake", evt => handleDelete(evt));
$cupcake_list.on("click", ".edit-cupcake", evt => showEdit(evt));
$cupcake_list.on("click", ".submit-edit", evt => handleEdit(evt));
getCupcakes();