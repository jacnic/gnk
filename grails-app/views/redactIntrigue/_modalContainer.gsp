<div class="modal fade" id="${id}" style="width:850px; margin-left:-425px">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">${title}</h4>
            </div>
            <div class="modal-body">
                <g:render template="${template}" />
            </div>
            %{--<div class="modal-footer">--}%
            %{--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>--}%
            %{--<button type="button" class="btn btn-primary">Save changes</button>--}%
            %{--</div>--}%
        </div>
    </div>
</div>