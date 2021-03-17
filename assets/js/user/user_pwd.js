$(function () {
    // 1.定义校验规则
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 1.2新旧密码不能重复
        samePwd: function (value) {
            // value是新密码，旧密码需要获取
            if (value == $("[name=oldPwd]").val()) {
                return "原密码和新密码不能相同！";
            }
        },
        // 1.3两次新密码要必须一致
        rePwd: function (value) {
            // value 是确认新密码，新密码要获取
            if (value != $("[name=newPwd]").val()) {
                return '两次新密码要必须一致!';
            }
        }
    });

    // 2.表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功！')
                $('.layui-form')[0].reset();

            }
        })
    })
})