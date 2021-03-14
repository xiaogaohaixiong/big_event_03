// 入口函数
$(function () {
    // 点击去注册账号，隐藏登录，显示注册
    $('.link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 点击去登录账号，隐藏注册页面，显示登录页面
    $('.link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 自定义验证规则
    let form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 再次确认密码
        repwd: function (value) {
            // 选择器必须带空格，选择的是后代中的input，name属性值为password的哪一个标签
            let pwd = $('.reg-box input[name=password]').val();
            // 进行对比
            if (value !== pwd) {
                return '两次密码输入不一致！';
            }
        }
    });

    // 注册功能
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                //提交成功后处理代码
                // alert(res.message);
                // 手动切换到登录表单
                $('.link_login').click();
                // 重置form表单
                $('#from_reg')[0].reset();
            }
        })
    });

    // 登录功能（给form标签绑定事件，button按钮触发提交 事件）
    $('#form_login').submit(function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 提交信息,保存token ，跳转页面
                // 保存token，未来接口要使用token
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })
})