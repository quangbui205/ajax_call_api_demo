$(document).ready(function() {

    let productModal = $('#productModal');
    let formInput = $('#formInput');
    let bodyTable = $('#bodyTable');

    //lấy toàn bộ dữ liệu từ api và ghép vào
    $.ajax({
        url: 'https://quangbuiminh.com/api/products',
        type: 'GET',
    }).done(function(res) {

        setBodyTable(res.data)
    });

    //Bắt sự kiện khi bấm nút thêm mới sản phẩm
    $('#btnAddProduct').on('click', function () {
        document.getElementById('productModalTitle').innerText = 'Thêm sản phẩm';

        //Xóa các dữ liệu ở các ô input
        formInput.find('#id').remove();
        ['name', 'price', 'quantity', 'description', 'product_site', 'created_by'].forEach(field => {
            productModal.find('#' + field).val('');
        });

        productModal.modal('show');
    });

    //Xử lý sự kiện bấm nút edit
    bodyTable.on('click', '.btnEdit',function () {
        let id = $(this).attr('data-id');

        //Lấy dữ liệu của 1 sản phẩm và gán vào form
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

            //Gán các dữ liệu vào từng ô input tương ứng
            ['name', 'price', 'quantity', 'description', 'product_site', 'created_by'].forEach(field => {
                productModal.find('#' + field).val(data[field]);
            });

            productModal.modal('show');
        });
    });

    //Bắt sự kiện khi đóng modal
    $('.btnClose').on('click', function () {
        productModal.find('.is-invalid').removeClass('is-invalid'); //xóa validate
    });

    //Validate Input sau khi submit form và xử lý dữ liệu sau khi submit form
    productModal.find('form').validate({
        submitHandler: function () {
            let id = formInput.find('#id').val();
            let data = formInput.serialize();

            //Nếu không tồn tại id thì thêm mới dữ liệu
            //Nếu tồn tại id thì cập nhật dữ liệu của bản ghi theo id
            if(id == undefined) {

                //Thêm mới 1 bản ghi
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

                    //Thêm mới thành công và thêm 1 row chứa thông tin của sản phẩm vừa thêm vào bảng
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

                //Cập nhập dữ liệu
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

                    //Cập nhật dữ liệu lên serve thành công thì cập nhật lại dữ liệu hiển thị bên FE
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

        //Validate các trường đầu vào
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

    //Xóa 1 bản ghi
    bodyTable.on('click', '.btnDelete',function () {

        //Hiển thị thông báo cảnh cáo
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

            //Nếu người dùng xác nhận xóa thì gọi api để xóa dữ liệu
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

                    //Xóa dữ liệu thành công thì ẩn dòng đó ở trên table
                    $('#product' + id).remove();
                });

            }
        })
    });

    $('#btnSearch').on('click', function (event) {

        event.preventDefault();
        let dataSearch = $('#formSearch').serialize();

        $.ajax({
            url: 'https://quangbuiminh.com/api/products/search',
            type: 'GET',
            dataType: 'JSON',
            data: dataSearch
        }).done(function(res) {
            if(res.status != '200') {
                notifyMessage('Thông báo lỗi!', res.message, 'error');
                return;
            }
            setBodyTable(res.data);
        })
    })

    $('#btnCancelSearch').on('click', function (event) {
        $.ajax({
            url: 'https://quangbuiminh.com/api/products',
            type: 'GET',
        }).done(function(res) {
            if(res.status != '200') {
                notifyMessage('Thông báo lỗi!', res.message, 'error');
                return;
            }
            setBodyTable(res.data);
        })
    })

    function setBodyTable(datas) {
        let tableBody = document.getElementById("bodyTable");
        let html  = '';

        if (datas.length == 0) {
            html += '<tr><th colspan="9" style="text-align: center">Không có kết quả phù hợp</th></tr>';
            tableBody.innerHTML = html;
            return;
        }

        //gán dữ liệu vào thẻ HTML và sau đó gán vào phần body của bảng
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
    }


    //function dùng để hiển thị thông báo dùng sweetalert2
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