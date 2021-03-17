$(function () {
    // 1.自定义验证规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length < 2 || value.length > 6) {
                return "昵称长度为2-6位之间"
            }
        }
    });

    // 用户渲染
    initUserInfo();

    //导出layer
    let layer = layui.layer
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功就渲染
                form.val('formUserInfo', res.data);
            }
        })
    };

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认重置
        e.preventDefault();
        // 从新用户渲染
        initUserInfo();
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).setialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，用户信息修改成功！');
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInof();

            }
        })
    })
})