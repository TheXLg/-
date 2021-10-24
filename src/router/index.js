import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'hash',

    scrollBehavior(to, from, savedPosition) {
        // 非异步处理

        // if (savedPosition) {
        // 	return savedPosition
        // } else {
        // 	return {
        // 		x: 0,
        // 		y: 0
        // 	}
        // }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(savedPosition || {
                    x: 0,
                    y: 0
                })
            }, 2000)
            console.log(reject);
        })
    },
    routes: [{
            path: '/',
            name: 'Login',
            component: () => import('../components/Login')
        }, {
            path: '/table',
            name: 'Table',
            component: () => import('../components/Table')
        },
        {
            path: '/guest',
            name: 'Guest',
            component: () => import('../components/Guest')
        },
        {
            path: '/menu',
            name: 'Menu',
            component: () => import('@/components/Menu')
        }
    ]
})
//路由拦截
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem('memberId') || to.path == '/') {
        next(true)
    } else {
        next(false)
    }
    console.log(from)
})
export default router