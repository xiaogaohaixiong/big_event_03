$(function () {

    // 0.设置表单信息
    // 用等号切割，然后使用后面的值
    function initFrom() {
        let id = location.search.split('=')[1];
        console.log(id);

        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 渲染到form表单中
                form.val('form-edit', res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像！');

                }
                let newImgURL = baseURL + res.data.cover_img;
                // 为裁剪区域重新设置图片
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域

            }
        })
    }

    // 初始化分类
    let form = layui.form;
    let layer = layui.layer;

    initCate(); //调用函数

    // 封装
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 赋值，渲染form
                let htmlStr = template('tpl-cate', { data: res.data })
                $('[name=cate_id]').html(htmlStr);
                form.render();
                initFrom();
            }
        })
    };
    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $("#coverFile").click();
    })
    // 5.设置图片
    $('#file').on('change', function (e) {
        // 3.1 拿到用户选择的图片
        let file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return;
        }

        // 3.2 根据选择的文件，创建一个对应的Url 地址
        let imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });
    // 6.设置状态
    let state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    });

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建FormData对象，收集数据
        let fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求

                publishArticle(fd);
            })
    })

    // 封装，添加文章方法
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                // 失败判断
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，修改文章成功！');
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                })

            }
        })
    }

})