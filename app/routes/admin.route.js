const express = require('express');
const router = express.Router();

const { authAdmin } = require('../middlewares/authorization')

const { validate } = require('../validator/express.validator')
const { validateReq } = require('../../public/utils')


//======================== Manage Authentication =======================
const adminControllers = require('../controllers/admin/admin.controller')
router.get('/admin/signup', adminControllers.deafultAdminsignup)
router.post('/admin/login', validate('login'), validateReq, adminControllers.adminLogin)
router.get('/admin/profile', authAdmin, adminControllers.adminProfile)


//======================== Manage Client Details =======================
const clientControllers = require('../controllers/admin/client.controller')
router.post('/admin/client-review/add', validate('client-review/add'), validateReq, authAdmin, clientControllers.addClientReview)
router.put('/admin/client-review/edit/:review_id', validate('client-review/edit'), validateReq, authAdmin, clientControllers.editClientReview)
router.get('/admin/client-review/list', authAdmin, clientControllers.getClientReview)
router.delete('/admin/client-review/delete/:review_id', validate('client-review/delete'), validateReq, authAdmin, clientControllers.deleteClientReview)

router.post('/admin/client-logos/add', validate('client-logos/add'), validateReq, authAdmin, clientControllers.addClientLogos)
router.get('/admin/client-logos/list', authAdmin, clientControllers.getclientLogos)
router.delete('/admin/client-logos/delete/:logo_id', validate('client-logos/delete'), validateReq, authAdmin, clientControllers.deleteclientLogos)

//======================== Web Settings =======================
const settingControllers = require('../controllers/admin/webSettings.controller')
router.post('/admin/about-us', validate('about-us'), validateReq, authAdmin, settingControllers.addAboutUs)
router.get('/admin/about-us', authAdmin, settingControllers.getAboutUs)

router.post('/admin/company-settings',  validate('company-settings'), validateReq, authAdmin, settingControllers.addCompanySetting)
router.get('/admin/company-settings', authAdmin, settingControllers.getCompanySetting)


//======================== Manage Our Team =======================
const ourTeamControllers = require('../controllers/admin/ourTeam.controller')
router.post('/admin/our-team/add', validate('our-team/add'), validateReq, authAdmin, ourTeamControllers.addOurTeam)
router.put('/admin/our-team/edit/:member_id', validate('our-team/edit'), validateReq, authAdmin, ourTeamControllers.editOurTeam)
router.get('/admin/our-team/list', authAdmin, ourTeamControllers.getOurTeam)
router.delete('/admin/our-team/delete/:member_id', validate('our-team/delete'), validateReq, authAdmin, ourTeamControllers.deleteOurTeam)

//======================== Manage FAQs  =======================
const faqsControllers = require('../controllers/admin/faqs.controller')
router.post('/admin/faqs/add', validate('faqs/add'), validateReq, authAdmin, faqsControllers.addFaqs)
router.put('/admin/faqs/edit/:faq_id', validate('faqs/edit'), validateReq, authAdmin, faqsControllers.editFaqs)
router.get('/admin/faqs/list', authAdmin, faqsControllers.getFaqs)
router.delete('/admin/faqs/delete/:faq_id', validate('faqs/delete'), validateReq, authAdmin, faqsControllers.deleteFaqs)

//======================== Manage Banners  =======================
router.post('/admin/banners/add', validate('banners/add'), validateReq, authAdmin, settingControllers.addBanners)
router.put('/admin/banners/edit/:banner_id', validate('banners/edit'), validateReq, authAdmin, settingControllers.editBanners)
router.get('/admin/banners/list', authAdmin, settingControllers.getBanners)
router.delete('/admin/banners/delete/:banner_id', validate('banners/delete'), validateReq, authAdmin, settingControllers.deleteBanners)

//======================== Manage Blogs  =======================
const blogsControllers = require('../controllers/admin/blogs.controller')
router.post('/admin/blogs/add', validate('blogs/add'), validateReq, authAdmin, blogsControllers.addBlogs)
router.put('/admin/blogs/edit/:blog_id', validate('blogs/edit'), validateReq, authAdmin, blogsControllers.editBlogs)
router.get('/admin/blogs/list', authAdmin, blogsControllers.getBlogs)
router.delete('/admin/blogs/delete/:blog_id', validate('blogs/delete'), validateReq, authAdmin, blogsControllers.deleteBlogs)


module.exports = router
