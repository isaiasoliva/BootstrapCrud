const API = 'http://localhost/hugo/crud/index.php/api/';

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

function editar(id) {
    window.location.href = 'edicion.html?id=' + id;
}

function eliminar(id) {

    var urlApi = API + 'usuarios/eliminar/';

    if (id > 0) {

        urlApi += id;

        $.ajax({
            type: 'delete',
            url: urlApi,
            data: '',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                console.log(data);
            },
            error: function (result) {
                toastr.info('Ocurrio un error al llamar el servicio')
            }
        });
    }
}

function tblUsuarios(result) {

    if (result.status) {

        var tbl = '';

        $.each(result.result, function (i, usuario) {
            tbl += '<tr class="row' + (i + 1) + '">';
            tbl += '<td class="d-none d-md-table-cell">' + (i + 1) + '</td>';
            tbl += '<td class="d-none d-md-table-cell">' + usuario.nombre + '</td>';
            tbl += '<td class="d-none d-md-table-cell">' + usuario.apellidos + '</td>';
            tbl += '<td class="d-table-cell d-md-none">' + usuario.nombre + ' ' + usuario.apellidos + '</td>';
            tbl += '<td class="d-none d-md-table-cell"><div class="d-flex justify-content-center">';
            tbl += '<button class="btn btn-primary" onclick="editar(' + usuario.id + ')"><i class="fa fa-edit"></i> Editar</button>';
            tbl += '<button class="btn btn-danger ml-2 btnEliminar" data-id="' + usuario.id + '" data-usuario="' + usuario.nombre + ' ' + usuario.apellidos + '" data-toggle="modal" data-target="#eliminarUsuarioModal"><i class="fa fa-trash"></i> Eliminar</button>';
            tbl += '</div>';
            tbl += '</td>';
            tbl += '</tr>';
        });

        $('#usuarios-table-body').html(tbl);
    } else {
        toastr["error"]("Ocurrió un error al llamar al servicio")
    }

}

function listar(url) {
    $.ajax({
        type: 'get',
        url: url,
        data: '',
        contentType: 'application/json;charset=utf-8',
        traditional: true,
        success: tblUsuarios,
        error: function (result) {
            alert('Ocurrio un error al llamar el servicio');
        }
    });
}

$(document).ready(function () {

    var id;

    var fila;

    var url = API + 'usuarios/obtener/';

    listar(url);

    $('#btnBuscar').click(function () {

        var filtro = $('#cliente').val();
        console.log('filtro: ', filtro);


        console.log('url:', url);

        $.ajax({
            type: 'get',
            url: url + filtro,
            data: '',
            contentType: 'application/json;charset=utf-8',
            traditional: true,
            success: tblUsuarios,
            error: function (result) {
                console.log('result: ', result);
                alert('Ocurrio un error al llamar el servicio');
            }
        });

        filtro = '';
        $('#cliente').val('');
        $('#cliente').focus();
    })

    $('#btnNuevo').click(function () {
        window.location.href = 'edicion.html';
    });

    $('#eliminarUsuarioModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('usuario') // Extract info from data-* attributes
        id = button.data(id);

        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-body .usuario').text(recipient);
        modal.find('.modal-body input').val(recipient)
    });

    $('#btnEliminar').click(function () {

        eliminar(id.id);

        console.log('id: ', id.id);





        $('#usuarios-table-body tr .row' + id.id + '').remove();

        fila.remove();

        $('#eliminarUsuarioModal').modal('hide');

        id.id = 0;
    });

    $('#usuarios-table tbody').on('click', '.btnEliminar', function () {
        fila = $(this).closest('tr');
        console.log('fila: ', fila);


    });

    $('#btnMostrarTodo').click(function () {
        var url = API + 'usuarios/obtener/';

        listar(url);
    });


});