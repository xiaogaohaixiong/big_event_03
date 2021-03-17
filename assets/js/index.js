// 入口函数
$(function () {
    // 1.获取用户信息
    getUserInof();

    // 退出
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.退出到登录页面
            location.href = '/login.html';
            layer.close(index);
        });
    })
});

// 获取用户信息(封装到入口函数的外面)
// 原因：后面其他页面要调用。
function getUserInof() {
    // 发送ajax
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        data: {},
        // headers: {
        //     // 重新登录，因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || '',
        // },
        success: (res) => {
            console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, { icon: 5 });
            }
            // 请求成功，渲染头像
            renderAvatar(res.data);
        }
    })
};
function renderAvatar(user) {
    // 1.渲染名称（nickname优先，如果没有，就用username）
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 2.渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(name[0].toUpperCase())
    }
}