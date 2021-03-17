// 入口函数
$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        let dt = new Date(dtStr)

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 在个位数的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    let q = {
        pagenum: 1,  //页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: ''    //文章的状态，可选值有：已发布、草稿
    }

    // 2.初始化文章列表
    let layer = layui.layer;
    initTable();
    // 封装初始化文章列表函数
    function initTable() {
        // 发送ajax获取文章列表数据
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败！')
                }

                // 获取成功，渲染数据
                let htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    let form = layui.form; //导入form
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                // 校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 赋值渲染form
                let htmlStr = template('tpl-cate', { data: res.data })
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };
    // 4.筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let state = $("[name=state]").val();
        let cate_id = $("[name=cate_id]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;

        // 初始化文章列表
        initTable();
    })

    // 5.分页
    let laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',    //注意，这里的 test1 是 ID，不用加 # 号
            count: total,       //数据总数，从服务端得到
            limit: q.pagesize,   //每页几条  
            curr: q.pagenum,    //第几页

            // 分页模块设置，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发jump：分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit;
                q.pagenum = obj.curr;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    };

    // 6.删除
    // let layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        // console.log(Id);

        // 6.1显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('恭喜您，文章删除成功！')
                    // 页面汇总删除按钮个数等于1 ，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 因为我们添加成功l,所有要重新渲染页面中的数据
                    initTable();

                }
            })
            layer.close(index)
        });
    })
})