$(document).ready(function() {

    $.ajax({
        url: 'http://127.0.0.1:3600/api/products',
        type: 'GET',

    }).done(function(res) {
        console.log(res)
        let datas = res.data;
        let tableBody = document.getElementById("bodyTable");
        let html  = '';

        if (datas.length == 0) {
            html += '<tr><th colspan="9" style="text-align: center">Không có kết quả phù hợp</th></tr>';
            tableBody.innerHTML = html;
            return;
        }

        for (let i = 0; i < datas.length; i++) {
            html += '<tr>';
            html += '<th>' + datas[i].id +'</th>';
            html += '<th>' + datas[i].name +'</th>';
            html += '<th>' + (datas[i].description == null ? '' : datas[i].description) +'</th>';
            html += '<th>' + (datas[i].price == null ? '' : datas[i].price) +'</th>';
            html += '<th>' + datas[i].quantity +'</th>';
            html += '<th>' + (datas[i].product_site == null ? '' : datas[i].product_site) +'</th>';
            html += '<th>' + (datas[i].created_by == null ? '' : datas[i].created_by) +'</th>';
            html += '<th><button type="button" class="btn btn-outline-success btnEdit" data-id="' + datas[i].id + '">Chỉnh sửa</button></th>';
            html += '<th><button type="button" class="btn btn-outline-danger btnDelete" data-id="' + datas[i].id + '">Xóa</button></th>';
            html += '</tr>';
        }
        tableBody.innerHTML = html;


    });

    $('#formInput').on('submit', function (event) {
        let data = $('#formInput').serialize();
        console.log(data);
        event.preventDefault();
        $.ajax({
            url: 'http://127.0.0.1:3600/api/products',
            type: 'POST',
            dataType: 'HTML',
            data: data
        }).done(function(res) {
            console.log(res)
        });
    })
});