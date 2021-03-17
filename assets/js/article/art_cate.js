// 入口函数
$(function () {
    // 1.文章类别列表展示
    initArtCateList();

    // 封装函数
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                let htmlStr = template('tpl-art-cate', { data: res.data })
                $('tbody').html(htmlStr);

            }
        })
    }


    // 2.显示添加文章分类列表
    let layer = layui.layer;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    let indexAdd = null;
    // 3.提出文章分类添加（事件委托）
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                // console.log($(this).serialize());
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 因为我们添加成功l,所有要重新渲染页面中的数据
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功！')
                layer.close(indexAdd)
            }
        })
    });

    // 4.修改-展示表单
    let indexEdit = null;
    let form = layui.form;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: "修改文章分类",
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        // 4.2获取Id, 发送ajax获取数据，渲染到页面
        let Id = $(this).attr('data-id');

        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    });

    // 4.修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 因为我们添加成功l,所有要重新渲染页面中的数据
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功！')
                layer.close(indexEdit)
            }
        })
    });

    // 5.删除
    $('tbody').on('click', ".btn-delete", function () {

        let Id = $(this).attr('data-id');
        // console.log(Id);

        // 5.1显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    // 因为我们添加成功l,所有要重新渲染页面中的数据
                    initArtCateList();
                    layer.msg('恭喜您，文章类别删除成功！')
                    layer.close(index)
                }
            })
        });
    })

})