$(document).ready(function() {

    let productModal = $('#productModal');
    let formInput = $('#formInput');
    let bodyTable = $('#bodyTable');

    $.ajax({
        url: 'https://quangbuiminh.com/api/products',
        type: 'GET',
    }).done(function(res) {

        let datas = res.data;
        let tableBody = document.getElementById("bodyTable");
        let html  = '';

        if (datas.length == 0) {
            html += '<tr><th colspan="9" style="text-align: center">Không có kết quả phù hợp</th></tr>';
            tableBody.innerHTML = html;
            return;
        }

        for (let i = 0; i < datas.length; i++) {
            html += '<tr id="product' + datas[i].id + '">';
            html += '<th>' + datas[i].id + '</th>';
            html += '<th>' + datas[i].name + '</th>';
            html += '<th>' + (datas[i].description == null ? '' : datas[i].description) + '</th>';
            html += '<th>' + (datas[i].price == null ? '' : datas[i].price) + '</th>';
            html += '<th>' + datas[i].quantity + '</th>';
            html += '<th>' + (datas[i].product_site == null ? '' : datas[i].product_site) + '</th>';
            html += '<th>' + (datas[i].created_by == null ? '' : datas[i].created_by) + '</th>';
            html += '<th><button type="button" class="btn btn-outline-success btnEdit" data-id="' + datas[i].id + '">Chỉnh sửa</button></th>';
            html += '<th><button type="button" class="btn btn-outline-danger btnDelete" data-id="' + datas[i].id + '">Xóa</button></th>';
            html += '</tr>';
        }
        tableBody.innerHTML = html;
        notifyMessage('Thông báo!', res.message, 'success');

    });

    $('#btnAddProduct').on('click', function () {
        document.getElementById('productModalTitle').innerText = 'Thêm sản phẩm';
        formInput.find('#id').remove();
        ['name', 'price', 'quantity', 'description', 'product_site', 'created_by'].forEach(field => {
            productModal.find('#' + field).val('');
        });
        productModal.modal('show');
    });

    productModal.find('form').validate({
        submitHandler: function () {
            let id = formInput.find('#id').val();
            let data = formInput.serialize();

            if(id == undefined) {

                $.ajax({
                    url: 'https://quangbuiminh.com/api/products',
                    type: 'POST',
                    dataType: 'JSON',
                    data: data
                }).done(function(res) {
                    if(res.status != '200') {
                        notifyMessage('Thông báo lỗi!', res.message, 'error');
                        return;
                    }
                    notifyMessage('Thông báo!', res.message, 'success',2000);

                    let data = res.data;
                    let htmlTr = '';
                    htmlTr += '<tr id="product' + data.id + '">';
                    htmlTr += '<th>' + data.id + '</th>';
                    htmlTr += '<th>' + data.name + '</th>';
                    htmlTr += '<th>' + (data.description == null ? '' : data.description) + '</th>';
                    htmlTr += '<th>' + (data.price == null ? '' : data.price) + '</th>';
                    htmlTr += '<th>' + data.quantity + '</th>';
                    htmlTr += '<th>' + (data.product_site == null ? '' : data.product_site) + '</th>';
                    htmlTr += '<th>' + (data.created_by == null ? '' : data.created_by) + '</th>';
                    htmlTr += '<th><button type="button" class="btn btn-outline-success btnEdit" data-id="' + data.id + '">Chỉnh sửa</button></th>';
                    htmlTr += '<th><button type="button" class="btn btn-outline-danger btnDelete" data-id="' + data.id + '">Xóa</button></th>';
                    htmlTr += '</tr>';

                    bodyTable.append(htmlTr);

                    productModal.modal('hide');
                });
            } else {
                $.ajax({
                    url: 'https://quangbuiminh.com/api/products/' + id,
                    type: 'POST',
                    dataType: 'JSON',
                    data: data
                }).done(function(res) {
                    if(res.status != 200) {
                        notifyMessage('Thông báo lỗi!', res.message, 'error');
                        return;
                    }
                    formInput.find('#id').remove();
                    notifyMessage('Thông báo!', res.message, 'success',2000);

                    let data = res.data;
                    let htmlTr = '';

                    htmlTr += '<th>' + data.id + '</th>';
                    htmlTr += '<th>' + data.name + '</th>';
                    htmlTr += '<th>' + (data.description == null ? '' : data.description) + '</th>';
                    htmlTr += '<th>' + (data.price == null ? '' : data.price) + '</th>';
                    htmlTr += '<th>' + data.quantity + '</th>';
                    htmlTr += '<th>' + (data.product_site == null ? '' : data.product_site) + '</th>';
                    htmlTr += '<th>' + (data.created_by == null ? '' : data.created_by) + '</th>';
                    htmlTr += '<th><button type="button" class="btn btn-outline-success btnEdit" data-id="' + data.id + '">Chỉnh sửa</button></th>';
                    htmlTr += '<th><button type="button" class="btn btn-outline-danger btnDelete" data-id="' + data.id + '">Xóa</button></th>';

                    document.getElementById('product' + data.id).innerHTML = htmlTr;

                    productModal.modal('hide');
                });
            }
        },

        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength: 255
            },

            price: {
                required: true,
                digits: true,
                min: 1000,
            },

            quantity: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Tên sản phẩm không được để trống *",
                minlength: "Tên sản phẩm phải có độ dài ít nhất 2 ký tự *",
                maxlength: "Tên sản phẩm có độ dài không quá 255 ký tự *",
            },

            price: {
                required: "Giá sản phẩm không được để trống *",
                digits: "Giá sản phẩm phải là số nguyên *",
                min: "Giá sản phẩm không nhỏ hơn 1000 vnđ *",
            },

            quantity: {
                required: "Số lượng sản phẩm không được để trống *",
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });

    bodyTable.on('click', '.btnEdit',function () {
        let id = $(this).attr('data-id');

        $.ajax({
            url: 'https://quangbuiminh.com/api/products/' + id,
            type: 'GET',
        }).done(function(res) {
            if(res.status != 200) {
                notifyMessage('Thông báo lỗi!', res.message, 'error');
                return;
            }
            formInput.find('#id').remove();

            document.getElementById('productModalTitle').innerText = 'Chỉnh sửa thông tin sản phẩm';

            let data = res.data;

            formInput.append('<input type="hidden" name="id" id="id" value="' + id +'">');

            ['name', 'price', 'quantity', 'description', 'product_site', 'created_by'].forEach(field => {
                productModal.find('#' + field).val(data[field]);
            });

            productModal.modal('show');
        });
    });

    bodyTable.on('click', '.btnDelete',function () {

        Swal.fire({
            title: 'Cảnh báo!',
            icon: 'warning',
            text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy bỏ',
        }).then((result) => {
            if (result.value) {
                let id = $(this).attr('data-id');

                $.ajax({
                    url: 'https://quangbuiminh.com/api/products/' + id,
                    type: 'DELETE',
                }).done(function(res) {
                    if(res.status != 200) {
                        notifyMessage('Thông báo lỗi!', res.message, 'error');
                        return;
                    }
                    notifyMessage('Thông báo!', res.message, 'success',2000);
                    $('#product' + id).remove();
                });

            }
        })
    });

    function notifyMessage(title = 'Lỗi!', message = '', type = 'error', timeout = 5000) {
        if (!timeout) {
            timeout = 5000;
        }

        if (['success', 'info', 'warning', 'error'].indexOf(type) > -1) {
            Swal.fire({
                title: title,
                icon: type,
                text: message,
                showConfirmButton: true,
                confirmButtonText: 'Đóng',
                timer: timeout
            });
            return;
        }
        Swal.fire({
            title: title,
            icon: 'error',
            text: message,
            showConfirmButton: true,
            confirmButtonText: 'Đóng',
            timer: timeout
        });
        return;
    }
});