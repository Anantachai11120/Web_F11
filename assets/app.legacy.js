const storageKeys = {
  users: "lab_users",
  roomBookings: "lab_room_bookings",
  equipmentBookings: "lab_equipment_bookings",
  equipmentItems: "lab_equipment_items",
  equipmentTypes: "lab_equipment_types",
  session: "lab_session",
  announcements: "lab_announcements",
  lang: "lab_lang",
  homeInfo: "lab_home_info",
  responsibleStaff: "lab_responsible_staff",
  notifications: "lab_notifications",
  meta: "lab_meta",
};

const i18n = {
  th: {
    langLabel: "ภาษา",
    langTH: "ไทย",
    langEN: "English",
    brandName: "แลปชั้นใต้ดิน F11",
    langZH: "中文",
    langES: "Español",
    navHome: "หน้าหลัก",
    navRooms: "จองห้อง",
    navEquipment: "จองอุปกรณ์",
    navRegister: "สมัครสมาชิก",
    navVerify: "ยืนยันบัญชี",
    navLogin: "เข้าสู่ระบบ",
    navLogout: "ออกจากระบบ",
    navProfile: "โปรไฟล์",
    navAdmin: "แอดมิน",
    homeLabTitle: "เกี่ยวกับห้องปฏิบัติการ UNDERGROUND LAB F11",
    homeLabDesc:
      "ห้องปฏิบัติการแห่งนี้มุ่งพัฒนางานด้านหุ่นยนต์ รถอัตโนมัติ ระบบการบิน ปัญญาประดิษฐ์ (AI) และการทำ Optimization เพื่อแก้ปัญหาเชิงวิศวกรรมอย่างมีประสิทธิภาพ พร้อมสนับสนุนการเรียนรู้ การวิจัย และการสร้างต้นแบบนวัตกรรมในงานจริง",
    pendingLabel: "รออนุมัติห้อง",
    itemsLabel: "รายการ",
    fillAll: "กรอกข้อมูลให้ครบทุกช่อง",
    emailUsed: "อีเมลนี้ถูกใช้งานแล้ว",
    usernameUsed: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว",
    registerSuccess: "สมัครสำเร็จ รอแอดมินตรวจสอบและยืนยันสมาชิก",
    userNotFound: "ไม่พบบัญชีผู้ใช้",
    verifyWrong: "รหัสยืนยันไม่ถูกต้อง",
    verifySuccess: "ยืนยันบัญชีสำเร็จ สามารถเข้าสู่ระบบได้แล้ว",
    loginFail: "ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง",
    notVerified: "บัญชียังไม่ยืนยัน กรุณายืนยันก่อนเข้าสู่ระบบ",
    loginSuccess: "เข้าสู่ระบบสำเร็จ",
    logoutSuccess: "ออกจากระบบแล้ว",
    notLogin: "ยังไม่ได้เข้าสู่ระบบ",
    sessionText: "กำลังใช้งานในชื่อ: {{username}} ({{role}})",
    bookingSaved: "บันทึกรายการจองเรียบร้อย",
    roomFull: "รอบเวลานี้เต็มแล้ว (สูงสุด 20 คน)",
    responsibleRequired: "กรุณาเลือกบุคลากรผู้รับผิดชอบ",
    responsibleSaved: "เพิ่มบุคลากรเรียบร้อย",
    responsibleImageRequired: "กรุณาใส่รูปภาพอย่างน้อย 1 แบบ (URL หรืออัปโหลดไฟล์)",
    emailNotify: "ระบบเปิดหน้าส่งอีเมลแจ้งผู้รับผิดชอบแล้ว",
    emailSent: "ส่งอีเมลสำเร็จ",
    loginRequiredToBook: "กรุณาเข้าสู่ระบบก่อนจองห้องหรืออุปกรณ์",
    roomLimitPerDay: "ผู้ใช้งานจองห้องได้สูงสุด 1 ครั้งต่อวัน",
    roomLimitPerWeek: "ผู้ใช้งานจองห้องได้สูงสุด 3 ครั้งต่อสัปดาห์",
    roomLimitPerDayQuota: "ผู้ใช้งานจองห้องได้สูงสุด {{limit}} ครั้งต่อวัน",
    roomLimitPerWeekQuota: "ผู้ใช้งานจองห้องได้สูงสุด {{limit}} ครั้งต่อสัปดาห์",
    recentEmpty: "ยังไม่มีรายการล่าสุด",
    recentRoom: "จองห้อง {{room}} วันที่ {{date}} {{timeSlot}} ({{status}})",
    recentEquipment: "จองอุปกรณ์ {{item}} จำนวน {{quantity}}",
    statusPending: "รออนุมัติ",
    statusApproved: "อนุมัติแล้ว",
    statusRejected: "ไม่อนุมัติ",
    adminTypeMissing: "กรอกข้อมูลประกาศให้ครบ",
    imageRequired: "กรุณาเลือกรูปและกดครอปรูปก่อนบันทึก",
    cropReady: "ครอปภาพแล้ว พร้อมบันทึกโพสต์",
    cropPending: "เลือกรูปแล้ว กดครอปรูปเพื่อใช้งาน",
    cropEmpty: "ยังไม่ได้เลือกรูป",
    adminPostSaved: "เพิ่มประกาศ/ข่าวสารเรียบร้อย",
    announcementEmpty: "ยังไม่มีประกาศหรือข่าวสาร",
    adminAnnouncementEmpty: "ยังไม่มีประกาศ",
    roomApprovalEmpty: "ยังไม่มีรายการจองห้อง",
    verifiedYes: "แล้ว",
    verifiedNo: "ยัง",
    roleUser: "ผู้ใช้",
    roleAdmin: "แอดมิน",
    approvedBy: "อนุมัติโดย",
    purpose: "เหตุผล",
    booker: "ผู้จอง",
    accessDenied: "ต้องเข้าสู่ระบบด้วยสิทธิ์แอดมินก่อน",
    labSaveOk: "บันทึกข้อมูลส่วนล่างเรียบร้อย",
    labShowManagerLabel: "แสดงบล็อกผู้ดูแล",
    confirmDeleteUser: "ยืนยันลบผู้ใช้นี้ใช่หรือไม่?",
    confirmDeleteAnnouncement: "ยืนยันลบประกาศนี้ใช่หรือไม่?",
    confirmDeleteResponsible: "ยืนยันลบบุคลากรนี้ใช่หรือไม่?",
    cannotDeleteSelf: "ไม่สามารถลบบัญชีแอดมินที่กำลังล็อกอินอยู่",
    phoneLabel: "โทร",
    visitorsTotalText: "ทั้งหมด : {{count}} คน",
    visitorsTodayText: "วันนี้ : {{count}} คน",
    profileStudentId: "รหัสนักศึกษา",
    profileYear: "ชั้นปี",
    profileSchool: "สำนัก",
    profileMajor: "สาขา",
    profilePhone: "เบอร์ติดต่อ",
    profilePurpose: "วัตถุประสงค์",
    profileStatus: "สถานะ",
    profileNoRoomBookings: "ยังไม่มีรายการจองห้อง",
    profileQty: "จำนวน",
    profileUsageDate: "วันที่ใช้งาน",
    profileDetail: "รายละเอียด",
    profileNoEquipmentBookings: "ยังไม่มีรายการจองอุปกรณ์",
    profileTodayRoomCount: "วันนี้จองห้อง",
    profileWeekRoomCount: "สัปดาห์นี้จองห้อง",
    profileWeekQuotaLeft: "โควต้าสัปดาห์นี้คงเหลือ",
    equipmentNeedRoom: "ต้องมีการจองห้องที่อนุมัติแล้วในวันและเวลาเดียวกันก่อนจองอุปกรณ์",
    equipmentOutOfStock: "อุปกรณ์ไม่พอหรือหมด",
    equipmentNeedTime: "กรุณาเลือกเวลาที่ตรงกับการจองห้องที่อนุมัติแล้ว",
    equipmentNoMatchTime: "ไม่พบช่วงเวลาที่จองห้องไว้ในวันที่เลือก",
    equipmentAdminSaved: "บันทึกรายการอุปกรณ์เรียบร้อย",
    equipmentAdminSectionTitle: "จัดการรายการอุปกรณ์ (แอดมิน)",
    equipmentAdminImageRequired: "กรุณาเลือกรูปและกดครอปรูปก่อนบันทึกอุปกรณ์",
    confirmDeleteEquipment: "ยืนยันลบอุปกรณ์นี้ใช่หรือไม่?",
    equipmentReturnRequested: "ส่งคำขอคืนอุปกรณ์แล้ว รอผู้ดูแลยืนยัน",
    equipmentReturnConfirmSent: "ส่งอีเมลแจ้งคืนอุปกรณ์เรียบร้อย",
    equipmentReturnFailed: "ส่งอีเมลแจ้งคืนอุปกรณ์ไม่สำเร็จ",
    equipmentReturnProofRequired: "กรุณาแนบภาพหลักฐานการคืนอุปกรณ์ก่อนส่งคำขอ",
    equipmentReturnProofLabel: "หลักฐานการคืน",
    equipmentReturnStatusBorrowed: "กำลังยืม",
    equipmentReturnStatusRequested: "รอยืนยันการคืน",
    equipmentReturnStatusReturned: "คืนแล้ว",
    equipmentRequestReturnBtn: "แจ้งคืนอุปกรณ์",
    equipmentReturnPendingBtn: "รอยืนยันการคืน",
    equipmentReturnMixedResponsible: "ไม่สามารถคืนพร้อมกันได้ เพราะมีผู้รับผิดชอบคนละคน",
    cancelRoomBookingBtn: "ยกเลิกการจองห้อง",
    cancelEquipmentBookingBtn: "ยกเลิกการจองอุปกรณ์",
    cancelReturnRequestBtn: "ยกเลิกการคืน",
    confirmCancelRoomBooking: "ยืนยันยกเลิกการจองห้องนี้ใช่หรือไม่?",
    confirmCancelEquipmentBooking: "ยืนยันยกเลิกการจองอุปกรณ์นี้ใช่หรือไม่?",
    confirmCancelReturnRequest: "ยืนยันยกเลิกคำขอคืนอุปกรณ์นี้ใช่หรือไม่?",
    cancelSuccess: "ยกเลิกรายการเรียบร้อย",
    equipmentEmptyLabel: "หมด",
    equipmentLeftLabel: "คงเหลือ {{available}}/{{stock}}",
    equipmentTypeLabel: "ชนิด",
    equipmentBookedLabel: "ถูกจอง",
    equipmentTypeFilterLabel: "ชนิดอุปกรณ์",
    equipmentTypeAllFilter: "ทุกชนิด",
    equipmentFilterAvailable: "อุปกรณ์ที่พร้อมใช้งาน",
    equipmentPickHint: "เลือกอุปกรณ์ที่ต้องการจองจากรายการ",
    equipmentBookedEmpty: "ยังไม่มีอุปกรณ์ที่จองอยู่",
    equipmentReturnHint: "เลือกอุปกรณ์ที่ต้องการคืน แล้วกดปุ่มคืน",
    equipmentSelectDefault: "ยังไม่ได้เลือกอุปกรณ์",
    equipmentDateFirstHint: "กรุณาเลือกวันที่ก่อน ระบบจะแสดงช่วงเวลาที่คุณมีการจองห้องอนุมัติแล้ว",
    roomSelectHint: "",
    roomDailyHint: "สรุปผลรายวันจะแสดงเมื่อเลือกวันที่",
    roomHoverHint: "โฮเวอร์ไอคอนเพื่อดูชื่อผู้จอง และคลิกเพื่อดูรายละเอียด",
    roomRulesHeroTitle: "กฎการใช้งานห้องปฏิบัติการ Lab-F11",
    roomRulesStep1Title: "จำนวนผู้ใช้งาน",
    roomRulesStep1Desc: "จำกัดสูงสุด 20 คนต่อรอบเวลา",
    roomRulesStep2Title: "เลือกผู้รับผิดชอบ",
    roomRulesStep2Desc: "ต้องเลือกบุคลากรผู้รับผิดชอบก่อนส่งคำขอ",
    roomRulesStep3Title: "รอยืนยัน",
    roomRulesStep3Desc: "ระบบจะส่งอีเมลแจ้งเตือนเพื่อยืนยันการจอง",
    roomRequesterSectionTitle: "ข้อมูลผู้ขอใช้งาน",
    roomStatusSectionTitle: "สถานะการจอง",
    roomStatusSectionHint: "เลือกวันและเวลาเพื่อดูจำนวนที่จองแล้ว และจำนวนที่ยังว่าง",
    roomLegendAvailable: "ว่าง",
    roomLegendMine: "คุณจอง",
    roomLegendBooked: "จอง",
    roomRulesModalTitle: "กฎการใช้งานห้องปฏิบัติการ Lab-F11",
    roomRulesScopeLabel: "ขอบเขตพื้นที่ใช้งาน:",
    roomRulesScopeText:
      "จำกัดเฉพาะบริเวณภายนอกประตูทางเข้าไปจนถึงโซนเครื่องมือช่างเท่านั้น ยกเว้นกรณีพิเศษ เช่น การเรียนการสอนที่มีอาจารย์ควบคุม หรือเหตุผลสำคัญอื่น ๆ ซึ่งต้องได้รับอนุญาตเป็นรายกรณี",
    roomRulesTimeLabel: "ช่วงเวลาการใช้งาน:",
    roomRulesTimeText:
      "สามารถเข้าใช้งานได้เฉพาะวันทำการ เวลา 09:00 - 17:00 น. ทั้งนี้การเข้าใช้งานทุกครั้งต้องได้รับการยืนยันจากผู้ดูแลห้องปฏิบัติการก่อน จึงจะถือว่าได้รับอนุญาตอย่างสมบูรณ์",
    acceptBtn: "ยอมรับ",
    selectTime: "เลือกเวลา",
    quantityLabel: "จำนวน",
    detailMoreLabel: "รายละเอียดเพิ่มเติม",
    equipmentDetailPlaceholder: "เช่น ใช้ในโปรเจกต์วิชา...",
    responsibleStaffLabel: "บุคลากรผู้รับผิดชอบ",
    equipmentHeroTitle: "จองอุปกรณ์ห้องปฏิบัติการ",
    equipmentStep1Title: "เลือกวันและเวลา",
    equipmentStep1Desc: "ต้องตรงกับรายการจองห้องที่อนุมัติแล้ว",
    equipmentStep2Title: "เลือกอุปกรณ์",
    equipmentStep2Desc: "เลือกชนิดและจำนวนที่ต้องการใช้งาน",
    equipmentStep3Title: "แจ้งคืนอุปกรณ์",
    equipmentStep3Desc: "ใช้งานเสร็จแล้วกดคืน เพื่อให้ผู้ดูแลยืนยัน",
    equipmentBookingFormTitle: "แบบฟอร์มจองอุปกรณ์",
    equipmentBookerLabel: "ผู้จอง (อ้างอิงจากบัญชีที่ล็อกอิน)",
    equipmentBookerPlaceholder: "อ้างอิงชื่อไอดีผู้ใช้",
    equipmentDateLabel: "วันที่ต้องการใช้อุปกรณ์",
    equipmentSelectDateFromRoom: "เลือกวันที่จากการจองห้อง",
    equipmentTimeLabel: "เวลาที่ต้องการใช้อุปกรณ์",
    equipmentSelectedLabel: "อุปกรณ์ที่เลือก",
    equipmentAddItemBtn: "เพิ่มอุปกรณ์ที่เลือก",
    equipmentClearSelectionBtn: "ล้างรายการ",
    equipmentSelectedListEmpty: "ยังไม่มีอุปกรณ์ในรายการจอง",
    equipmentSelectionMaxReached: "เลือกได้สูงสุด 5 รายการต่อครั้ง",
    equipmentSelectionNeedItem: "กรุณาเลือกอุปกรณ์ก่อน",
    equipmentSelectionAdded: "เพิ่มรายการอุปกรณ์แล้ว",
    equipmentSelectionDuplicate: "อุปกรณ์นี้อยู่ในรายการแล้ว",
    equipmentNeedDate: "กรุณาเลือกวันที่จากการจองห้องก่อน",
    equipmentRuleHint:
      "กรุณาเลือกวันที่ก่อน ระบบจะแสดงช่วงเวลาที่คุณมีการจองห้องอนุมัติแล้ว แล้วเลือกอุปกรณ์จากรายการด้านขวา",
    saveEquipmentBookingBtn: "บันทึกการจองอุปกรณ์",
    equipmentListTitle: "รายการอุปกรณ์",
    equipmentListHint: "เลือกตัวกรองรายการและชนิดอุปกรณ์จากบล็อกเดียวกัน",
    equipmentListFilterLabel: "ตัวกรองรายการ",
    equipmentFilterAll: "อุปกรณ์ทั้งหมด",
    equipmentFilterBooked: "อุปกรณ์ที่จอง",
    equipmentCardHint: "คลิกการ์ดอุปกรณ์เพื่อเลือกจอง หรือเลือกจากรายการที่จองเพื่อคืน",
    returnAllEquipmentBtn: "คืนอุปกรณ์ทั้งหมด",
    equipmentNameLabel: "ชื่ออุปกรณ์",
    equipmentNamePlaceholder: "เช่น กล้องจุลทรรศน์",
    addEquipmentTypeLabel: "เพิ่มชนิดอุปกรณ์ใหม่",
    equipmentTypePlaceholder: "เช่น งานไม้",
    addTypeBtn: "เพิ่มชนิด",
    totalStockLabel: "จำนวนทั้งหมด",
    equipmentImageLabel: "รูปอุปกรณ์",
    saveEquipmentItemBtn: "บันทึกรายการอุปกรณ์",
    equipmentRulesModalTitle: "กฎการจองอุปกรณ์ (โปรดอ่านก่อนทำรายการ)",
    equipmentRulesItem1:
      "ผู้จองต้องเข้าสู่ระบบก่อนทุกครั้ง และต้องมีการจองห้องที่ได้รับอนุมัติแล้วในวันและเวลาเดียวกัน",
    equipmentRulesItem2: "สามารถเลือกจองได้เฉพาะอุปกรณ์ที่มีจำนวนคงเหลือเพียงพอในช่วงเวลาที่เลือก",
    equipmentRulesItem3:
      "ผู้จองต้องระบุผู้รับผิดชอบก่อนยืนยันการจอง เพื่อใช้ในการติดตามการใช้งานและการคืนอุปกรณ์",
    equipmentRulesItem4:
      "เมื่อใช้งานเสร็จ ต้องกดแจ้งคืนอุปกรณ์ในระบบ และรอผู้ดูแลยืนยันการรับคืนผ่านอีเมล",
    equipmentRulesItem5:
      "หากอุปกรณ์ชำรุดหรือสูญหาย ต้องแจ้งผู้ดูแลทันที และปฏิบัติตามระเบียบของห้องปฏิบัติการ",
    equipmentReturnModalTitle: "แนบหลักฐานการคืนอุปกรณ์",
    equipmentReturnModalHint: "อัปโหลดรูปหลักฐานก่อน แล้วกดปุ่มคืนอุปกรณ์เพื่อส่งอีเมลถึงผู้ดูแล",
    equipmentReturnSubmitBtn: "คืนอุปกรณ์",
    equipmentBatchItemsLabel: "รายการ",
    equipmentTotalQtyLabel: "รวม",
    roomSlotTitle: "ช่อง {{index}}",
    roomSlotEmpty: "ช่อง {{index}} ว่าง",
    roomSummaryText: "ห้อง {{room}} | {{date}} | {{timeSlot}} (ยืนยันแล้ว {{approved}}/20 คน | รอยืนยัน {{pending}})",
    roomDailySummaryText: "สรุปวันที่ {{date}}: จองแล้ว {{booked}} คน | ว่าง {{available}} คน (รวม 40 คน/วัน) | รอยืนยัน {{pending}} คน",
    roomSlotMineTitle: "ช่อง {{index}} คุณจอง ({{owner}})",
    roomSlotOtherTitle: "ช่อง {{index}} {{owner}} จอง",
    roomSlotEmptyDetail: "ช่อง {{index}}: ว่าง",
    roomSlotDetailFull:
      "<strong>ช่อง {{index}}</strong> | ผู้ขอ: {{requester}} | สมาชิก: {{member1}}, {{member2}} | วัตถุประสงค์: {{purpose}} | วันที่: {{date}} | เวลา: {{timeSlot}} | สถานะ: {{status}}",
    toggleShowEdit: "แสดงฟอร์มแก้ไข",
    toggleHideEdit: "ซ่อนฟอร์มแก้ไข",
    noResponsibleOptions: "ยังไม่มีบุคลากรผู้รับผิดชอบ",
    noResponsibleItems: "ยังไม่มีบุคลากร",
    deleteBtn: "ลบ",
    studentIdUsed: "รหัสนักศึกษานี้ถูกใช้งานแล้ว",
    adminUserMeta:
      "รหัส: {{studentId}} | ปี: {{year}} | สำนัก: {{school}} | สาขา: {{major}} | โทร: {{phone}}",
    verifyMemberBtn: "ยืนยันสมาชิก",
    verifiedMemberBtn: "เป็นสมาชิก",
    deleteUserBtn: "ลบผู้ใช้",
    viewProfileBtn: "ดูโปรไฟล์",
    adminProfileTitle: "โปรไฟล์ผู้ใช้งาน",
    adminProfileEmpty: "เลือกผู้ใช้เพื่อดูข้อมูลการจองห้องและอุปกรณ์",
    adminProfileRoomHistory: "ประวัติจองห้อง",
    adminProfileEquipmentHistory: "ประวัติยืมอุปกรณ์",
    adminBorrowSummaryTitle: "สรุปการยืมอุปกรณ์",
    adminBorrowSummaryHint: "แสดงรายการอุปกรณ์ที่ถูกยืม และผู้ใช้ที่ยังไม่คืน",
    adminBorrowEmpty: "ยังไม่มีรายการยืมอุปกรณ์ค้างคืน",
    adminBorrowByItem: "อุปกรณ์",
    adminBorrowOutstandingCount: "ยังไม่คืน {{count}} รายการ",
    adminBorrowUser: "ผู้ยืม",
    adminBorrowStatus: "สถานะ",
    adminBorrowDate: "วันที่ใช้งาน",
    adminBorrowRemindBtn: "แจ้งเตือนให้คืน",
    adminBorrowNoEmail: "ไม่พบอีเมลผู้ยืมรายการนี้",
    adminBorrowReminderSent: "ส่งอีเมลแจ้งเตือนการคืนอุปกรณ์แล้ว",
    adminRoomSummaryTitle: "สรุปการจองห้อง",
    adminRoomSummaryHint: "แสดงสถานะและรายละเอียดรายการจองห้องทั้งหมด",
    adminRoomSummaryEmpty: "ยังไม่มีรายการจองห้อง",
    adminRoomPendingCount: "รออนุมัติ {{count}}",
    adminRoomApprovedCount: "อนุมัติแล้ว {{count}}",
    adminRoomRejectedCount: "ไม่อนุมัติ {{count}}",
    adminRoomMembers: "สมาชิก",
    adminRoomResponsible: "ผู้รับผิดชอบ",
    adminQuotaLabel: "โควต้าห้อง: วันละ {{daily}} | สัปดาห์ละ {{weekly}}",
    adminAddQuotaBtn: "เพิ่มโควต้า",
    adminAddQuotaPrompt: "เพิ่มโควต้าจองห้องรายสัปดาห์อีกกี่รอบ?",
    adminAddQuotaSaved: "เพิ่มโควต้าสัปดาห์ให้ {{name}} แล้ว ({{weekly}} รอบ/สัปดาห์)",
    adminQuotaModalTitle: "เพิ่มโควต้าการจองห้อง",
    adminQuotaCurrent: "โควต้าปัจจุบัน: วันละ {{daily}} | สัปดาห์ละ {{weekly}}",
    adminQuotaAmountLabel: "จำนวนโควต้าที่ต้องการเพิ่ม (รายสัปดาห์)",
    adminQuotaSaveBtn: "บันทึกโควต้า",
    adminQuotaCancelBtn: "ยกเลิก",
    adminBroadcastTitle: "แจ้งเตือนทางอีเมล",
    adminBroadcastHint: "เลือกกลุ่มผู้รับหรือเลือกเป็นรายคน แล้วส่งข้อความแจ้งเตือน",
    adminBroadcastGroup: "กลุ่มผู้รับ",
    adminBroadcastAll: "ทั้งหมด",
    adminBroadcastUsers: "ผู้ใช้",
    adminBroadcastStaff: "เจ้าหน้าที่ผู้ดูแล",
    adminBroadcastRecipients: "รายชื่ออีเมลผู้รับ",
    adminBroadcastSubject: "หัวข้ออีเมล",
    adminBroadcastMessage: "ข้อความ",
    adminBroadcastSend: "ส่งอีเมลแจ้งเตือน",
    adminBroadcastNoRecipients: "กรุณาเลือกผู้รับอย่างน้อย 1 รายการ",
    adminBroadcastNoMessage: "กรุณากรอกหัวข้อและข้อความ",
    adminBroadcastSent: "ส่งอีเมลแจ้งเตือนเรียบร้อย",
    adminBroadcastTargetUser: "ผู้ใช้",
    adminBroadcastTargetStaff: "เจ้าหน้าที่",
    announcementLoadMore: "โหลดเพิ่ม",
    announcementReadMore: "คลิกเพื่ออ่านต่อ",
    announcementCollapse: "คลิกอีกครั้งเพื่อย่อ",
    announcementAddBtn: "เพิ่มโพสต์",
    announcementEditBtn: "แก้ไขโพสต์",
    announcementSaved: "บันทึกโพสต์เรียบร้อย",
    announcementEditorCreateTitle: "เพิ่มประกาศ / ข่าวสาร",
    announcementEditorEditTitle: "แก้ไขประกาศ / ข่าวสาร",
    announcementEditorType: "ประเภทโพสต์",
    announcementEditorTitleLabel: "หัวข้อโพสต์",
    announcementEditorContentLabel: "เนื้อหาโพสต์",
    announcementEditorImageUrlLabel: "ลิงก์รูปภาพ (ไม่บังคับ)",
    announcementEditorImageFileLabel: "หรืออัปโหลดรูปจากเครื่อง",
    announcementEditorSaveBtn: "บันทึกโพสต์",
    announcementEditorCancelBtn: "ยกเลิก",
    announcementTypeAnnouncement: "ประกาศ",
    announcementTypeNews: "ข่าวสาร",
    adminHeroTitle: "แผงจัดการแอดมิน",
    adminHeroDesc: "เพิ่มประกาศ/ข่าวสาร, อนุมัติการจองห้อง และแต่งตั้งผู้ใช้คนอื่นเป็นแอดมิน",
    adminGateTitle: "ไม่สามารถเข้าถึงหน้านี้",
    adminSectionMenuTitle: "เมนูจัดการแอดมิน",
    adminTabAnnouncement: "เพิ่มประกาศ / ข่าวสาร",
    adminTabRoomApproval: "อนุมัติการจองห้อง",
    adminTabAdminRole: "จัดการสิทธิ์แอดมิน",
    adminTabResponsible: "จัดการบุคลากรผู้รับผิดชอบแลป",
    adminTabEquipmentSummary: "สรุปการยืมอุปกรณ์",
    adminTabEmailNotify: "แจ้งเตือนทางอีเมล",
    adminAnnounceTypeLabel: "ประเภท",
    adminAnnounceTypeSelect: "เลือกประเภท",
    adminAnnounceTitleLabel: "หัวข้อ",
    adminAnnounceTitlePlaceholder: "เช่น ปิดปรับปรุงห้อง Lab-B204",
    adminAnnounceImageLabel: "รูปภาพโพสต์",
    adminCropZoomLabel: "ซูมภาพ",
    adminCropXLabel: "เลื่อนแนวนอน",
    adminCropYLabel: "เลื่อนแนวตั้ง",
    adminCropApplyBtn: "ครอปรูป",
    adminAnnounceContentLabel: "รายละเอียด",
    adminAnnounceContentPlaceholder: "รายละเอียดประกาศหรือข่าว",
    adminSaveAnnouncementBtn: "บันทึกประกาศ",
    adminAnnouncementListTitle: "รายการประกาศ",
    adminRoleHint: "กดปุ่มเพื่อแต่งตั้งผู้ใช้งานเป็นแอดมินเพิ่ม",
    adminResponsibleNameLabel: "ชื่อบุคลากร",
    adminResponsibleNamePlaceholder: "เช่น อ.สุชาติ ใจดี",
    adminResponsibleEmailLabel: "อีเมล",
    adminResponsibleImageUrlLabel: "รูปภาพ (URL)",
    adminResponsibleImageFileLabel: "หรืออัปโหลดรูปจากคอม",
    adminResponsibleAddBtn: "เพิ่มบุคลากร",
    adminResponsibleListTitle: "รายการบุคลากร",
    adminBroadcastSubjectPlaceholder: "เช่น แจ้งเตือนการใช้งานระบบแลป",
    adminBroadcastMessagePlaceholder: "พิมพ์ข้อความแจ้งเตือนที่ต้องการส่ง",
  },
  en: {
    langLabel: "Language",
    langTH: "Thai",
    langEN: "English",
    brandName: "UNDERGROUND LAB F11",
    langZH: "Chinese",
    langES: "Spanish",
    navHome: "Home",
    navRooms: "Room Booking",
    navEquipment: "Equipment Booking",
    navRegister: "Register",
    navVerify: "Verify",
    navLogin: "Login",
    navLogout: "Logout",
    navProfile: "Profile",
    navAdmin: "Admin",
    homeLabTitle: "About UNDERGROUND LAB F11",
    homeLabDesc:
      "This lab focuses on robotics, autonomous vehicles, aviation systems, artificial intelligence (AI), and optimization to solve engineering problems effectively, while supporting learning, research, and real-world innovation prototyping.",
    pendingLabel: "Pending Rooms",
    itemsLabel: "items",
    fillAll: "Please complete all required fields.",
    emailUsed: "This email is already in use.",
    usernameUsed: "This username is already in use.",
    registerSuccess: "Registered successfully. Please wait for admin verification.",
    userNotFound: "User account not found.",
    verifyWrong: "Invalid verification code.",
    verifySuccess: "Account verified. You can now log in.",
    loginFail: "Invalid username/email or password.",
    notVerified: "Your account is not verified yet.",
    loginSuccess: "Login successful.",
    logoutSuccess: "Logged out successfully.",
    notLogin: "Not logged in.",
    sessionText: "Current session: {{username}} ({{role}})",
    bookingSaved: "Booking saved successfully.",
    roomFull: "This timeslot is full (max 20 people).",
    responsibleRequired: "Please select a responsible staff member.",
    responsibleSaved: "Responsible staff added.",
    responsibleImageRequired: "Please provide at least one image source (URL or file upload).",
    emailNotify: "Email draft has been opened for responsible staff.",
    emailSent: "Email sent successfully.",
    loginRequiredToBook: "Please login before booking room or equipment.",
    roomLimitPerDay: "You can book a room only once per day.",
    roomLimitPerWeek: "You can book a room up to 3 times per week.",
    roomLimitPerDayQuota: "You can book up to {{limit}} room booking(s) per day.",
    roomLimitPerWeekQuota: "You can book up to {{limit}} room booking(s) per week.",
    recentEmpty: "No recent activity yet.",
    recentRoom: "Room booking {{room}} on {{date}} {{timeSlot}} ({{status}})",
    recentEquipment: "Equipment booking {{item}} qty {{quantity}}",
    statusPending: "pending",
    statusApproved: "approved",
    statusRejected: "rejected",
    adminTypeMissing: "Please complete announcement fields.",
    imageRequired: "Please select an image and crop it before posting.",
    cropReady: "Image cropped and ready to post.",
    cropPending: "Image selected. Click crop before posting.",
    cropEmpty: "No image selected yet.",
    adminPostSaved: "Announcement/news added.",
    announcementEmpty: "No announcements yet.",
    adminAnnouncementEmpty: "No announcements.",
    roomApprovalEmpty: "No room bookings.",
    verifiedYes: "yes",
    verifiedNo: "no",
    roleUser: "user",
    roleAdmin: "admin",
    approvedBy: "Approved by",
    purpose: "Purpose",
    booker: "Booker",
    accessDenied: "Admin login is required to access this page.",
    labSaveOk: "Bottom section data saved.",
    labShowManagerLabel: "Show manager block",
    confirmDeleteUser: "Confirm deleting this user?",
    confirmDeleteAnnouncement: "Confirm deleting this announcement?",
    confirmDeleteResponsible: "Confirm deleting this staff member?",
    cannotDeleteSelf: "You cannot delete the currently logged-in admin account.",
    phoneLabel: "Phone",
    visitorsTotalText: "Total: {{count}} visitors",
    visitorsTodayText: "Today: {{count}} visitors",
    profileStudentId: "Student ID",
    profileYear: "Year",
    profileSchool: "School",
    profileMajor: "Major",
    profilePhone: "Phone",
    profilePurpose: "Purpose",
    profileStatus: "Status",
    profileNoRoomBookings: "No room bookings yet.",
    profileQty: "Qty",
    profileUsageDate: "Usage date",
    profileDetail: "Details",
    profileNoEquipmentBookings: "No equipment bookings yet.",
    profileTodayRoomCount: "Today's room bookings",
    profileWeekRoomCount: "This week's room bookings",
    profileWeekQuotaLeft: "Weekly quota left",
    equipmentNeedRoom: "You must have an approved room booking with the same date/time before booking equipment.",
    equipmentOutOfStock: "Equipment is out of stock or not enough quantity.",
    equipmentNeedTime: "Please select a timeslot matching your approved room booking.",
    equipmentNoMatchTime: "No approved room booking timeslot found for selected date.",
    equipmentAdminSaved: "Equipment item saved.",
    equipmentAdminSectionTitle: "Equipment catalog management (Admin)",
    equipmentAdminImageRequired: "Please select and crop an image before saving equipment.",
    confirmDeleteEquipment: "Confirm deleting this equipment item?",
    equipmentReturnRequested: "Return request sent. Waiting for responsible staff confirmation.",
    equipmentReturnConfirmSent: "Return confirmation email sent.",
    equipmentReturnFailed: "Failed to send return confirmation email.",
    equipmentReturnProofRequired: "Please attach return proof image before sending request.",
    equipmentReturnProofLabel: "Return proof",
    equipmentReturnStatusBorrowed: "Borrowed",
    equipmentReturnStatusRequested: "Return requested",
    equipmentReturnStatusReturned: "Returned",
    equipmentRequestReturnBtn: "Request Return",
    equipmentReturnPendingBtn: "Waiting Return Confirm",
    equipmentReturnMixedResponsible: "Cannot return all together because bookings have different responsible staff.",
    cancelRoomBookingBtn: "Cancel Room Booking",
    cancelEquipmentBookingBtn: "Cancel Equipment Booking",
    cancelReturnRequestBtn: "Cancel Return Request",
    confirmCancelRoomBooking: "Confirm cancel this room booking?",
    confirmCancelEquipmentBooking: "Confirm cancel this equipment booking?",
    confirmCancelReturnRequest: "Confirm cancel this equipment return request?",
    cancelSuccess: "Canceled successfully.",
    equipmentEmptyLabel: "Out of stock",
    equipmentLeftLabel: "Available {{available}}/{{stock}}",
    equipmentTypeLabel: "Type",
    equipmentBookedLabel: "Booked",
    equipmentTypeFilterLabel: "Equipment Type",
    equipmentTypeAllFilter: "All types",
    equipmentFilterAvailable: "Available equipment",
    equipmentPickHint: "Select equipment from the list to book.",
    equipmentBookedEmpty: "No active booked equipment.",
    equipmentReturnHint: "Select booked equipment and click return.",
    equipmentSelectDefault: "No equipment selected",
    equipmentDateFirstHint: "Please select a date first. The system will show approved room-booking timeslots.",
    roomSelectHint: "",
    roomDailyHint: "Daily summary will appear after selecting a date.",
    roomHoverHint: "Hover icon to view name and click to view details",
    roomRulesHeroTitle: "Lab-F11 Room Usage Rules",
    roomRulesStep1Title: "Capacity",
    roomRulesStep1Desc: "Maximum 20 users per timeslot.",
    roomRulesStep2Title: "Choose Responsible Staff",
    roomRulesStep2Desc: "You must select responsible staff before submitting the request.",
    roomRulesStep3Title: "Wait for Confirmation",
    roomRulesStep3Desc: "The system will send an email notification for booking confirmation.",
    roomRequesterSectionTitle: "Requester Information",
    roomStatusSectionTitle: "Booking Status",
    roomStatusSectionHint: "Select date and time to view booked and available slots.",
    roomLegendAvailable: "Available",
    roomLegendMine: "Booked by you",
    roomLegendBooked: "Booked",
    roomRulesModalTitle: "Lab-F11 Room Usage Rules",
    roomRulesScopeLabel: "Usage area:",
    roomRulesScopeText:
      "Limited to the area outside the entrance up to the workshop tools zone only. Special cases (e.g., supervised classes or important reasons) require case-by-case approval.",
    roomRulesTimeLabel: "Operating time:",
    roomRulesTimeText:
      "Accessible only on working days from 09:00 to 17:00. Every entry must be confirmed by lab staff before being fully permitted.",
    acceptBtn: "Accept",
    selectTime: "Select time",
    quantityLabel: "Quantity",
    detailMoreLabel: "Additional details",
    equipmentDetailPlaceholder: "e.g. Used in course project...",
    responsibleStaffLabel: "Responsible Staff",
    equipmentHeroTitle: "Lab Equipment Booking",
    equipmentStep1Title: "Choose Date and Time",
    equipmentStep1Desc: "Must match an approved room booking timeslot.",
    equipmentStep2Title: "Select Equipment",
    equipmentStep2Desc: "Choose equipment type and quantity.",
    equipmentStep3Title: "Request Return",
    equipmentStep3Desc: "After use, request return for staff confirmation.",
    equipmentBookingFormTitle: "Equipment Booking Form",
    equipmentBookerLabel: "Booker (from logged-in account)",
    equipmentBookerPlaceholder: "Uses logged-in account ID",
    equipmentDateLabel: "Equipment usage date",
    equipmentSelectDateFromRoom: "Select date from room bookings",
    equipmentTimeLabel: "Equipment usage time",
    equipmentSelectedLabel: "Selected equipment",
    equipmentAddItemBtn: "Add selected equipment",
    equipmentClearSelectionBtn: "Clear selection",
    equipmentSelectedListEmpty: "No equipment selected yet.",
    equipmentSelectionMaxReached: "You can select up to 5 items per booking.",
    equipmentSelectionNeedItem: "Please select equipment first.",
    equipmentSelectionAdded: "Equipment added to your booking list.",
    equipmentSelectionDuplicate: "This equipment is already in your list.",
    equipmentNeedDate: "Please select a date from your room bookings first.",
    equipmentRuleHint:
      "Please select a date first. The system will show approved room-booking timeslots, then select equipment from the right list.",
    saveEquipmentBookingBtn: "Save equipment booking",
    equipmentListTitle: "Equipment list",
    equipmentListHint: "Use one filter block for both list and equipment type.",
    equipmentListFilterLabel: "List filter",
    equipmentFilterAll: "All equipment",
    equipmentFilterBooked: "Booked equipment",
    equipmentCardHint: "Click equipment cards to book, or select from booked list to return.",
    returnAllEquipmentBtn: "Return all equipment",
    equipmentNameLabel: "Equipment name",
    equipmentNamePlaceholder: "e.g. Microscope",
    addEquipmentTypeLabel: "Add new equipment type",
    equipmentTypePlaceholder: "e.g. Woodwork",
    addTypeBtn: "Add type",
    totalStockLabel: "Total stock",
    equipmentImageLabel: "Equipment image",
    saveEquipmentItemBtn: "Save equipment item",
    equipmentRulesModalTitle: "Equipment Booking Rules (Please read before booking)",
    equipmentRulesItem1:
      "You must be logged in and have an approved room booking in the same date and timeslot.",
    equipmentRulesItem2:
      "You can book only equipment with sufficient available quantity in the selected timeslot.",
    equipmentRulesItem3:
      "You must select responsible staff before confirming equipment booking.",
    equipmentRulesItem4:
      "After use, request equipment return in the system and wait for staff confirmation by email.",
    equipmentRulesItem5:
      "If equipment is damaged or lost, report to staff immediately and follow lab regulations.",
    equipmentReturnModalTitle: "Attach Return Proof",
    equipmentReturnModalHint: "Upload return proof first, then click Return Equipment to send email to staff.",
    equipmentReturnSubmitBtn: "Return Equipment",
    equipmentBatchItemsLabel: "items",
    equipmentTotalQtyLabel: "total",
    roomSlotTitle: "Slot {{index}}",
    roomSlotEmpty: "Slot {{index}} available",
    roomSummaryText:
      "Room {{room}} | {{date}} | {{timeSlot}} (Approved {{approved}}/20 | Pending {{pending}})",
    roomDailySummaryText:
      "Date {{date}}: Booked {{booked}} | Available {{available}} (Total 40/day) | Pending {{pending}}",
    roomSlotMineTitle: "Slot {{index}} booked by you ({{owner}})",
    roomSlotOtherTitle: "Slot {{index}} booked by {{owner}}",
    roomSlotEmptyDetail: "Slot {{index}}: available",
    roomSlotDetailFull:
      "<strong>Slot {{index}}</strong> | Requester: {{requester}} | Members: {{member1}}, {{member2}} | Purpose: {{purpose}} | Date: {{date}} | Time: {{timeSlot}} | Status: {{status}}",
    toggleShowEdit: "Show edit form",
    toggleHideEdit: "Hide edit form",
    noResponsibleOptions: "No responsible staff available.",
    noResponsibleItems: "No staff available.",
    deleteBtn: "Delete",
    studentIdUsed: "This student ID is already in use.",
    adminUserMeta:
      "ID: {{studentId}} | Year: {{year}} | School: {{school}} | Major: {{major}} | Phone: {{phone}}",
    verifyMemberBtn: "Verify member",
    verifiedMemberBtn: "Member",
    deleteUserBtn: "Delete user",
    viewProfileBtn: "View profile",
    adminProfileTitle: "User profile",
    adminProfileEmpty: "Select a user to view room and equipment booking history.",
    adminProfileRoomHistory: "Room booking history",
    adminProfileEquipmentHistory: "Equipment borrowing history",
    adminBorrowSummaryTitle: "Equipment Borrowing Summary",
    adminBorrowSummaryHint: "Shows borrowed equipment and users who have not returned yet.",
    adminBorrowEmpty: "No outstanding equipment borrowing records.",
    adminBorrowByItem: "Equipment",
    adminBorrowOutstandingCount: "{{count}} outstanding records",
    adminBorrowUser: "Borrower",
    adminBorrowStatus: "Status",
    adminBorrowDate: "Usage date",
    adminBorrowRemindBtn: "Send Return Reminder",
    adminBorrowNoEmail: "No borrower email found for this record.",
    adminBorrowReminderSent: "Return reminder email sent.",
    adminRoomSummaryTitle: "Room Booking Summary",
    adminRoomSummaryHint: "Shows status and detailed room-booking records.",
    adminRoomSummaryEmpty: "No room-booking records.",
    adminRoomPendingCount: "Pending {{count}}",
    adminRoomApprovedCount: "Approved {{count}}",
    adminRoomRejectedCount: "Rejected {{count}}",
    adminRoomMembers: "Members",
    adminRoomResponsible: "Responsible",
    adminQuotaLabel: "Room quota: {{daily}}/day | {{weekly}}/week",
    adminAddQuotaBtn: "Add quota",
    adminAddQuotaPrompt: "How many weekly room-booking quota rounds to add?",
    adminAddQuotaSaved: "Updated {{name}} weekly quota to {{weekly}}/week.",
    adminQuotaModalTitle: "Add room-booking quota",
    adminQuotaCurrent: "Current quota: {{daily}}/day | {{weekly}}/week",
    adminQuotaAmountLabel: "Weekly quota to add",
    adminQuotaSaveBtn: "Save quota",
    adminQuotaCancelBtn: "Cancel",
    adminBroadcastTitle: "Email Notification",
    adminBroadcastHint: "Choose recipients by group or select specific emails, then send a message.",
    adminBroadcastGroup: "Recipient group",
    adminBroadcastAll: "All",
    adminBroadcastUsers: "Users",
    adminBroadcastStaff: "Responsible staff",
    adminBroadcastRecipients: "Recipient email list",
    adminBroadcastSubject: "Email subject",
    adminBroadcastMessage: "Message",
    adminBroadcastSend: "Send notification email",
    adminBroadcastNoRecipients: "Please select at least one recipient.",
    adminBroadcastNoMessage: "Please enter both subject and message.",
    adminBroadcastSent: "Notification email sent.",
    adminBroadcastTargetUser: "User",
    adminBroadcastTargetStaff: "Staff",
    announcementLoadMore: "Load more",
    announcementReadMore: "Click to read more",
    announcementCollapse: "Click again to collapse",
    announcementAddBtn: "Add post",
    announcementEditBtn: "Edit post",
    announcementSaved: "Post saved.",
    announcementEditorCreateTitle: "Create announcement / news",
    announcementEditorEditTitle: "Edit announcement / news",
    announcementEditorType: "Post type",
    announcementEditorTitleLabel: "Post title",
    announcementEditorContentLabel: "Post content",
    announcementEditorImageUrlLabel: "Image URL (optional)",
    announcementEditorImageFileLabel: "Or upload image",
    announcementEditorSaveBtn: "Save post",
    announcementEditorCancelBtn: "Cancel",
    announcementTypeAnnouncement: "Announcement",
    announcementTypeNews: "News",
    adminHeroTitle: "Admin Panel",
    adminHeroDesc: "Add announcements/news, approve room bookings, and promote users to admin.",
    adminGateTitle: "Access Denied",
    adminSectionMenuTitle: "Admin Menu",
    adminTabAnnouncement: "Add Announcement / News",
    adminTabRoomApproval: "Approve Room Bookings",
    adminTabAdminRole: "Admin Permissions",
    adminTabResponsible: "Manage responsible lab staff",
    adminTabEquipmentSummary: "Equipment Borrowing Summary",
    adminTabEmailNotify: "Email Notification",
    adminAnnounceTypeLabel: "Type",
    adminAnnounceTypeSelect: "Select type",
    adminAnnounceTitleLabel: "Title",
    adminAnnounceTitlePlaceholder: "e.g. Lab-B204 maintenance closure",
    adminAnnounceImageLabel: "Post Image",
    adminCropZoomLabel: "Zoom",
    adminCropXLabel: "Horizontal Shift",
    adminCropYLabel: "Vertical Shift",
    adminCropApplyBtn: "Crop Image",
    adminAnnounceContentLabel: "Details",
    adminAnnounceContentPlaceholder: "Announcement or news details",
    adminSaveAnnouncementBtn: "Save Announcement",
    adminAnnouncementListTitle: "Announcement List",
    adminRoleHint: "Click button to promote a user to admin.",
    adminResponsibleNameLabel: "Staff name",
    adminResponsibleNamePlaceholder: "e.g. Dr. Suchart Jaidee",
    adminResponsibleEmailLabel: "Email",
    adminResponsibleImageUrlLabel: "Image (URL)",
    adminResponsibleImageFileLabel: "Or upload image from computer",
    adminResponsibleAddBtn: "Add staff",
    adminResponsibleListTitle: "Staff list",
    adminBroadcastSubjectPlaceholder: "e.g. Lab system usage notice",
    adminBroadcastMessagePlaceholder: "Type the notification message you want to send",
  },
  zh: {
    langLabel: "语言",
    langTH: "泰语",
    langEN: "英语",
    langZH: "中文",
    langES: "西班牙语",
    navHome: "主页",
    navRooms: "房间预约",
    navEquipment: "设备预约",
    navRegister: "注册",
    navVerify: "验证账户",
    navLogin: "登录",
    navLogout: "退出登录",
    navProfile: "个人资料",
    navAdmin: "管理员",
    pendingLabel: "房间待审批",
    itemsLabel: "项",
    fillAll: "请填写所有必填项。",
    emailUsed: "此邮箱已被使用。",
    usernameUsed: "此用户名已被使用。",
    registerSuccess: "注册成功，请等待管理员审核。",
    userNotFound: "未找到用户账户。",
    verifyWrong: "验证码不正确。",
    verifySuccess: "账户验证成功，现在可以登录。",
    loginFail: "用户名/邮箱或密码不正确。",
    notVerified: "账户尚未验证。",
    loginSuccess: "登录成功。",
    logoutSuccess: "已退出登录。",
    notLogin: "尚未登录。",
    sessionText: "当前会话：{{username}} ({{role}})",
    bookingSaved: "预约已保存。",
    roomFull: "该时段已满（最多20人）。",
    responsibleRequired: "请选择负责人员。",
    responsibleSaved: "负责人员已添加。",
    responsibleImageRequired: "请至少提供一种图片方式（URL 或上传文件）。",
    emailNotify: "已打开邮件草稿通知负责人。",
    emailSent: "邮件发送成功。",
    loginRequiredToBook: "请先登录再预约房间或设备。",
    roomLimitPerDay: "每天最多预约1次房间。",
    roomLimitPerWeek: "每周最多预约3次房间。",
    recentEmpty: "暂无最近活动。",
    recentRoom: "房间预约 {{room}} 日期 {{date}} {{timeSlot}} ({{status}})",
    recentEquipment: "设备预约 {{item}} 数量 {{quantity}}",
    statusPending: "待审批",
    statusApproved: "已批准",
    statusRejected: "未批准",
    adminTypeMissing: "请完整填写公告信息。",
    imageRequired: "请先选择并裁剪图片后再发布。",
    cropReady: "图片已裁剪，可发布。",
    cropPending: "已选择图片，请先裁剪。",
    cropEmpty: "尚未选择图片。",
    adminPostSaved: "公告/新闻已添加。",
    announcementEmpty: "暂无公告。",
    adminAnnouncementEmpty: "暂无公告。",
    roomApprovalEmpty: "暂无房间预约。",
    verifiedYes: "是",
    verifiedNo: "否",
    roleUser: "用户",
    roleAdmin: "管理员",
    approvedBy: "审批人",
    purpose: "用途",
    booker: "预约人",
    accessDenied: "需要管理员权限才能访问此页面。",
    labSaveOk: "底部信息已保存。",
    confirmDeleteUser: "确认删除此用户？",
    confirmDeleteAnnouncement: "确认删除此公告？",
    confirmDeleteResponsible: "确认删除此人员？",
    cannotDeleteSelf: "不能删除当前登录的管理员账户。",
  },
  es: {
    langLabel: "Idioma",
    langTH: "Tailandés",
    langEN: "Inglés",
    langZH: "Chino",
    langES: "Español",
    navHome: "Inicio",
    navRooms: "Reserva de sala",
    navEquipment: "Reserva de equipo",
    navRegister: "Registro",
    navVerify: "Verificar cuenta",
    navLogin: "Iniciar sesión",
    navLogout: "Cerrar sesión",
    navProfile: "Perfil",
    navAdmin: "Admin",
    pendingLabel: "Salas pendientes",
    itemsLabel: "elementos",
    fillAll: "Completa todos los campos obligatorios.",
    emailUsed: "Este correo ya está en uso.",
    usernameUsed: "Este usuario ya está en uso.",
    registerSuccess: "Registro exitoso. Espera la verificación del admin.",
    userNotFound: "No se encontró la cuenta.",
    verifyWrong: "Código de verificación incorrecto.",
    verifySuccess: "Cuenta verificada. Ya puedes iniciar sesión.",
    loginFail: "Usuario/correo o contraseña incorrectos.",
    notVerified: "Tu cuenta aún no está verificada.",
    loginSuccess: "Inicio de sesión exitoso.",
    logoutSuccess: "Sesión cerrada correctamente.",
    notLogin: "Sin iniciar sesión.",
    sessionText: "Sesión actual: {{username}} ({{role}})",
    bookingSaved: "Reserva guardada correctamente.",
    roomFull: "Este horario está lleno (máx. 20 personas).",
    responsibleRequired: "Selecciona el responsable.",
    responsibleSaved: "Responsable agregado.",
    responsibleImageRequired: "Proporciona al menos una imagen (URL o archivo).",
    emailNotify: "Se abrió el borrador de correo para el responsable.",
    emailSent: "Correo enviado correctamente.",
    loginRequiredToBook: "Inicia sesión antes de reservar sala o equipo.",
    roomLimitPerDay: "Solo puedes reservar una vez por día.",
    roomLimitPerWeek: "Puedes reservar hasta 3 veces por semana.",
    recentEmpty: "Sin actividad reciente.",
    recentRoom: "Reserva de sala {{room}} el {{date}} {{timeSlot}} ({{status}})",
    recentEquipment: "Reserva de equipo {{item}} cant. {{quantity}}",
    statusPending: "pendiente",
    statusApproved: "aprobado",
    statusRejected: "rechazado",
    adminTypeMissing: "Completa los datos del anuncio.",
    imageRequired: "Selecciona y recorta una imagen antes de publicar.",
    cropReady: "Imagen recortada y lista para publicar.",
    cropPending: "Imagen seleccionada. Haz clic en recortar.",
    cropEmpty: "Aún no se seleccionó imagen.",
    adminPostSaved: "Anuncio/noticia agregado.",
    announcementEmpty: "Sin anuncios.",
    adminAnnouncementEmpty: "Sin anuncios.",
    roomApprovalEmpty: "Sin reservas de sala.",
    verifiedYes: "sí",
    verifiedNo: "no",
    roleUser: "usuario",
    roleAdmin: "admin",
    approvedBy: "Aprobado por",
    purpose: "Propósito",
    booker: "Solicitante",
    accessDenied: "Se requiere cuenta admin para esta página.",
    labSaveOk: "Se guardó la información inferior.",
    confirmDeleteUser: "¿Confirmar eliminación de este usuario?",
    confirmDeleteAnnouncement: "¿Confirmar eliminación de este anuncio?",
    confirmDeleteResponsible: "¿Confirmar eliminación de este responsable?",
    cannotDeleteSelf: "No puedes eliminar al admin actual.",
  },
};

const staticEn = {
  "ระบบจัดการข้อมูลแลปแบบมินิมอล": "Minimal Lab Information Management",
  "แสดงภาพรวมข้อมูลผู้ใช้งาน การจอง และประกาศจากแอดมินในหน้าเดียว รองรับทั้งมือถือและเดสก์ท็อป":
    "A dashboard for users, bookings, and admin announcements in one view.",
  "สรุประบบ": "System Summary",
  "สมาชิกทั้งหมด": "Total Members",
  "ยืนยันแล้ว": "Verified",
  "จองห้อง": "Room Bookings",
  "จองอุปกรณ์": "Equipment Bookings",
  "รออนุมัติห้อง: 0 รายการ": "Pending room approvals: 0",
  "ประกาศ / ข่าวสาร": "Announcements / News",
  "กิจกรรมล่าสุด": "Recent Activity",
  "จองข้อมูลการใช้ห้องแลป": "Room Booking",
  "ระบุผู้ใช้งาน ห้อง วันที่ และวัตถุประสงค์การใช้งาน เพื่อบันทึกคิวในระบบ":
    "Provide user, room, date, and purpose to create booking records.",
  "แบบฟอร์มจองห้อง": "Room Booking Form",
  "ชื่อผู้จอง": "Booker Name",
  "ห้อง": "Room",
  "วันที่ใช้งาน": "Booking Date",
  "ช่วงเวลา": "Time Slot",
  "วัตถุประสงค์": "Purpose",
  "บันทึกการจองห้อง": "Submit Room Booking",
  "คำแนะนำการจอง": "Booking Guide",
  "จองข้อมูลการใช้อุปกรณ์แลป": "Equipment Booking",
  "ระบุรายการ จำนวน และช่วงวันที่ใช้งาน เพื่อวางแผนการเตรียมอุปกรณ์":
    "Provide item, quantity, and date to reserve equipment.",
  "แบบฟอร์มจองอุปกรณ์": "Equipment Booking Form",
  "รายการอุปกรณ์": "Equipment Item",
  "จำนวน": "Quantity",
  "วันที่ต้องการใช้": "Usage Date",
  "รายละเอียดเพิ่มเติม": "Details",
  "บันทึกการจองอุปกรณ์": "Submit Equipment Booking",
  "เงื่อนไขเบื้องต้น": "Basic Rules",
  "สมัครสมาชิกระบบแลป": "Lab Registration",
  "ฟอร์มสมัครสมาชิก": "Register Form",
  "ชื่อ-นามสกุล": "Full Name",
  "ชื่อผู้ใช้": "Username",
  "อีเมล": "Email",
  "รหัสผ่าน": "Password",
  "สมัครสมาชิก": "Register",
  "ยืนยันบัญชีสมาชิก": "Account Verification",
  "ฟอร์มยืนยัน": "Verification Form",
  "รหัสยืนยัน": "Verification Code",
  "ยืนยันบัญชี": "Verify Account",
  "เข้าสู่โปรแกรมจัดการแลป": "Lab System Login",
  "ฟอร์มเข้าสู่ระบบ": "Login Form",
  "ชื่อผู้ใช้ หรือ อีเมล": "Username or Email",
  "เข้าสู่ระบบ": "Login",
  "สถานะการใช้งาน": "Session Status",
  "ออกจากระบบ": "Logout",
  "แผงจัดการแอดมิน": "Admin Panel",
  "เพิ่มประกาศ / ข่าวสาร": "Add Announcement / News",
  "ประเภท": "Type",
  "หัวข้อ": "Title",
  "รายละเอียด": "Content",
  "บันทึกประกาศ": "Save Announcement",
  "รายการประกาศ": "Announcement List",
  "อนุมัติการจองห้อง": "Approve Room Bookings",
  "จัดการสิทธิ์แอดมิน": "Admin Permissions",
  "ไม่สามารถเข้าถึงหน้านี้": "Access Denied",
  "รูปภาพโพสต์": "Post Image",
  "ซูมภาพ": "Zoom",
  "เลื่อนแนวนอน": "Horizontal Shift",
  "เลื่อนแนวตั้ง": "Vertical Shift",
  "ครอปรูป": "Crop Image",
  "ยังไม่ได้เลือกรูป": "No image selected yet.",
  "แบบฟอร์มจองห้องปฏิบัติการ Lab-F11": "Lab-F11 Room Booking Form",
  "กรอกข้อมูลผู้ขอใช้งาน สมาชิก วัตถุประสงค์ และเลือกบุคลากรผู้รับผิดชอบก่อนส่งคำขอ":
    "Fill requester, members, purpose, and choose responsible staff before submitting.",
  "ข้อมูลผู้ขอใช้งาน": "Requester Information",
  "ชื่อ-นามสกุล ผู้ขออนุญาต": "Requester Full Name",
  "ชื่อ-นามสกุล สมาชิกลำดับที่ 1": "Member 1 Full Name",
  "ชื่อ-นามสกุล สมาชิกลำดับที่ 2": "Member 2 Full Name",
  "ชื่อ-นามสกุล สมาชิกลำดับที่ 1 (ไม่บังคับ)": "Member 1 Full Name (Optional)",
  "ชื่อ-นามสกุล สมาชิกลำดับที่ 2 (ไม่บังคับ)": "Member 2 Full Name (Optional)",
  "วัตถุประสงค์ในการเข้าใช้ห้องปฏิบัติการ": "Purpose of Lab Usage",
  "โปรเจกต์รายวิชา": "Course Project",
  "โปรเจกต์จบ": "Final Project",
  "อื่นๆ": "Other",
  "กรณีเลือกอื่นๆ โปรดระบุ": "If other, please specify",
  "วัน เดือน ปี ที่ต้องการเข้าใช้งาน": "Requested Date",
  "เวลาที่ต้องการใช้งาน": "Requested Time",
  "เลือกเวลา": "Select time",
  "บุคลากรผู้รับผิดชอบ": "Responsible Staff",
  "ส่งคำขอจองห้อง": "Submit Room Request",
  "สถานะการจอง (20 ช่อง)": "Booking Status (20 slots)",
  "วัน เดือน ปี ที่ต้องการดูสถานะ": "Date to view status",
  "เวลาที่ต้องการดูสถานะ": "Time to view status",
  "ว่าง": "Available",
  "คุณจอง": "Booked by you",
  "คนอื่นจอง": "Booked by others",
  "อุปกรณ์บางชนิดต้องผ่านการอบรมก่อนใช้งาน": "Some equipment requires training before use.",
  "คืนอุปกรณ์ภายในเวลาที่ระบบระบุ": "Return equipment within the specified time.",
  "กรณีชำรุดให้แจ้งผู้ดูแลทันที": "Report any damage to staff immediately.",
  "ข้อมูลที่บันทึกจะแสดงผลรวมในหน้าหลัก": "Saved data will be summarized on the home page.",
  "ผู้ใช้ต้องมีการจองห้องที่อนุมัติแล้วในวัน/เวลาเดียวกันก่อน จึงจะเลือกเวลาจองอุปกรณ์และรายการอุปกรณ์ได้":
    "Users must have an approved room booking for the same date/time before selecting equipment booking time and items.",
  "วันที่ต้องการใช้อุปกรณ์": "Equipment usage date",
  "เวลาที่ต้องการใช้อุปกรณ์": "Equipment usage time",
  "ผู้ใช้ต้องมีรายการจองห้อง (อนุมัติแล้ว) ก่อนจองอุปกรณ์":
    "Users must have an approved room booking before equipment booking.",
  "วันและเวลาจองอุปกรณ์ต้องตรงกับวันและเวลาที่จองห้อง":
    "Equipment booking date/time must match room booking date/time.",
  "ตอนกดจองอุปกรณ์ยังไม่ส่งอีเมล และจะส่งตอนแจ้งคืนอุปกรณ์":
    "No email is sent on equipment booking; email is sent when return is requested.",
  "ผู้ดูแลต้องกดยืนยันการรับคืนผ่านอีเมล": "Responsible staff must confirm return via email.",
  "กรุณาเลือกวันที่ก่อน ระบบจะแสดงช่วงเวลาที่คุณมีการจองห้องอนุมัติแล้ว แล้วเลือกอุปกรณ์จากรายการด้านขวา":
    "Please select a date first. The system will show approved room-booking timeslots, then select equipment from the right list.",
  "จัดการรายการอุปกรณ์ (แอดมิน)": "Equipment catalog management (Admin)",
  "ชื่ออุปกรณ์": "Equipment name",
  "อุปกรณ์ที่เลือก": "Selected equipment",
  "ยังไม่ได้เลือกอุปกรณ์": "No equipment selected",
  "รูปอุปกรณ์": "Equipment image",
  "บันทึกรายการอุปกรณ์": "Save equipment item",
  "รายการอุปกรณ์": "Equipment list",
  "ตัวกรองรายการ": "Filter",
  "อุปกรณ์ทั้งหมด": "All equipment",
  "อุปกรณ์ที่จอง": "Booked equipment",
  "คลิกการ์ดอุปกรณ์เพื่อเลือกจอง หรือเลือกจากรายการที่จองเพื่อคืน":
    "Click an equipment card to book, or select booked items to return.",
  "คืนอุปกรณ์ที่เลือก": "Return selected",
  "คืนอุปกรณ์ทั้งหมด": "Return all",
  "จำนวนทั้งหมด": "Total stock",
  "แก้ไข": "Edit",
  "กรุณาเลือกวันที่ก่อน ระบบจะแสดงช่วงเวลาที่คุณมีการจองห้องอนุมัติแล้ว":
    "Please select a date first. The system will show timeslots where your room booking is approved.",
  "เข้าสู่ระบบด้วยชื่อผู้ใช้หรืออีเมล และรหัสผ่าน": "Login with username/email and password.",
  "เช่น Anantachai2000 หรือ name@univ.ac.th": "e.g. Anantachai2000 or name@univ.ac.th",
  "ยังไม่มีบัญชี?": "No account yet?",
  "บัญชีแอดมินเริ่มต้น: Anantachai2000 / Wave_862543":
    "Default admin account: Anantachai2000 / Wave_862543",
  "สร้างบัญชีผู้ใช้เพื่อจองห้องและอุปกรณ์ โดยหลังสมัครต้องยืนยันบัญชีก่อนเข้าสู่ระบบ":
    "Create an account for booking room/equipment. Account verification is required before login.",
  "ชื่อผู้ใช้งาน": "User full name",
  "รหัสนักศึกษา": "Student ID",
  "เช่น B6501234": "e.g. B6501234",
  "ชั้นปี": "Year",
  "เลือกชั้นปี": "Select year",
  "ปี 1": "Year 1",
  "ปี 2": "Year 2",
  "ปี 3": "Year 3",
  "ปี 4": "Year 4",
  "ปี 5+": "Year 5+",
  "สำนัก": "School",
  "เช่น สำนักวิชาวิศวกรรมศาสตร์": "e.g. School of Engineering",
  "สาขา": "Major",
  "เช่น วิศวกรรมคอมพิวเตอร์": "e.g. Computer Engineering",
  "เบอร์ติดต่อ": "Phone number",
  "เช่น 08xxxxxxxx": "e.g. 08xxxxxxxx",
  "เช่น anan01": "e.g. anan01",
  "อย่างน้อย 6 ตัวอักษร": "At least 6 characters",
  "อัปโหลดภาพโปรไฟล์": "Upload profile image",
  "ขั้นตอนถัดไป": "Next steps",
  "สมัครสมาชิกให้เรียบร้อยในหน้านี้": "Complete registration on this page.",
  "ใช้รหัสยืนยันในหน้ายืนยันบัญชี": "Use verification code on the verification page.",
  "เข้าสู่ระบบเมื่อสถานะบัญชีเป็นยืนยันแล้ว": "Login after account is verified.",
  "โปรไฟล์ผู้ใช้งาน": "User Profile",
  "ข้อมูลสมาชิกและประวัติการใช้งานการจองห้อง/อุปกรณ์ของบัญชีนี้":
    "Member information and room/equipment booking history.",
  "ข้อมูลสมาชิก": "Member Information",
  "สรุปการจอง": "Booking Summary",
  "จองห้องทั้งหมด": "Total room bookings",
  "จองอุปกรณ์ทั้งหมด": "Total equipment bookings",
  "รายการจองห้อง": "Room booking list",
  "รายการจองอุปกรณ์": "Equipment booking list",
  "เพิ่มประกาศ/ข่าวสาร, อนุมัติการจองห้อง และแต่งตั้งผู้ใช้คนอื่นเป็นแอดมิน":
    "Add announcements/news, approve room bookings, and promote users to admin.",
  "ต้องเข้าสู่ระบบด้วยสิทธิ์แอดมินก่อน": "Admin login is required.",
  "เลือกประเภท": "Select type",
  "ประกาศ": "Announcement",
  "ข่าวสาร": "News",
  "เช่น ปิดปรับปรุงห้อง Lab-B204": "e.g. Lab-B204 maintenance closure",
  "รายละเอียดประกาศหรือข่าว": "Announcement or news details",
  "กดปุ่มเพื่อแต่งตั้งผู้ใช้งานเป็นแอดมินเพิ่ม": "Click button to promote a user to admin.",
  "จัดการบุคลากรผู้รับผิดชอบแลป": "Manage responsible lab staff",
  "ชื่อบุคลากร": "Staff name",
  "เช่น อ.สุชาติ ใจดี": "e.g. Dr. Suchart Jaidee",
  "รูปภาพ (URL)": "Image (URL)",
  "หรืออัปโหลดรูปจากคอม": "Or upload image from computer",
  "เพิ่มบุคลากร": "Add staff",
  "รายการบุคลากร": "Staff list",
  "ผู้เยี่ยมชมเว็บไซต์": "Website visitors",
  "ที่อยู่": "Address",
  "ข้อมูลติดต่อ": "Contact",
  "หน่วยประสานงาน": "Coordination units",
  "ผู้ดูแล": "Manager",
  "ชื่อหน่วยงาน": "Organization name",
  "เบอร์โทร": "Phone",
  "หน่วยประสานงาน (1 บรรทัดต่อ 1 รายการ)": "Coordination units (one line per item)",
  "ผู้เยี่ยมชมทั้งหมด": "Total visitors",
  "ผู้เยี่ยมชมวันนี้": "Today's visitors",
  "ลิงก์แผนที่ (Google Maps Embed URL)": "Map link (Google Maps Embed URL)",
  "ชื่อผู้ดูแล": "Manager name",
  "ตำแหน่งผู้ดูแล": "Manager role",
  "รูปผู้ดูแล (URL)": "Manager image (URL)",
  "อัปโหลดรูปผู้ดูแล (จากคอม)": "Upload manager image (from computer)",
  "บันทึกข้อมูลส่วนล่าง": "Save bottom section",
  "กฎการจองห้องปฏิบัติการ: จำกัดสูงสุด 20 คนต่อรอบเวลา | เลือกผู้รับผิดชอบก่อนส่งคำขอ | ระบบจะส่งอีเมลแจ้งเตือนเพื่อยืนยัน":
    "Room booking rules: max 20 people per timeslot | choose responsible staff before submit | email notification will be sent for confirmation",
};

const staticZh = {
  "ระบบจัดการข้อมูลแลปแบบมินิมอล": "极简实验室信息管理系统",
  "แสดงภาพรวมข้อมูลผู้ใช้งาน การจอง และประกาศจากแอดมินในหน้าเดียว รองรับทั้งมือถือและเดสก์ท็อป":
    "在同一页面显示用户、预约与管理员公告概览，支持手机与桌面。",
  "สรุประบบ": "系统概览",
  "สมาชิกทั้งหมด": "总成员",
  "ยืนยันแล้ว": "已验证",
  "จองห้อง": "房间预约",
  "จองอุปกรณ์": "设备预约",
  "ประกาศ / ข่าวสาร": "公告 / 新闻",
  "กิจกรรมล่าสุด": "最近活动",
  "จองข้อมูลการใช้อุปกรณ์แลป": "实验室设备预约",
  "ระบุรายการ จำนวน และช่วงวันที่ใช้งาน เพื่อวางแผนการเตรียมอุปกรณ์":
    "请填写设备、数量和日期，以便安排准备。",
  "แบบฟอร์มจองอุปกรณ์": "设备预约表单",
  "รายการอุปกรณ์": "设备项目",
  "จำนวน": "数量",
  "วันที่ต้องการใช้": "使用日期",
  "รายละเอียดเพิ่มเติม": "附加说明",
  "บันทึกการจองอุปกรณ์": "提交设备预约",
  "เงื่อนไขเบื้องต้น": "基本规则",
  "สมัครสมาชิกระบบแลป": "实验室系统注册",
  "ฟอร์มสมัครสมาชิก": "注册表单",
  "ชื่อ-นามสกุล": "姓名",
  "ชื่อผู้ใช้": "用户名",
  "อีเมล": "邮箱",
  "รหัสผ่าน": "密码",
  "สมัครสมาชิก": "注册",
  "เข้าสู่โปรแกรมจัดการแลป": "登录实验室系统",
  "ฟอร์มเข้าสู่ระบบ": "登录表单",
  "ชื่อผู้ใช้ หรือ อีเมล": "用户名或邮箱",
  "เข้าสู่ระบบ": "登录",
  "ออกจากระบบ": "退出登录",
  "แผงจัดการแอดมิน": "管理员面板",
  "เพิ่มประกาศ / ข่าวสาร": "新增公告 / 新闻",
  "ประเภท": "类型",
  "หัวข้อ": "标题",
  "รายละเอียด": "内容",
  "บันทึกประกาศ": "保存公告",
  "รายการประกาศ": "公告列表",
  "อนุมัติการจองห้อง": "审批房间预约",
  "จัดการสิทธิ์แอดมิน": "管理管理员权限",
  "ไม่สามารถเข้าถึงหน้านี้": "无法访问此页面",
  "รูปภาพโพสต์": "帖子图片",
  "ซูมภาพ": "缩放",
  "เลื่อนแนวนอน": "水平移动",
  "เลื่อนแนวตั้ง": "垂直移动",
  "ครอปรูป": "裁剪图片",
  "ยังไม่ได้เลือกรูป": "尚未选择图片",
};

const staticEs = {
  "ระบบจัดการข้อมูลแลปแบบมินิมอล": "Sistema minimalista de gestión de laboratorio",
  "แสดงภาพรวมข้อมูลผู้ใช้งาน การจอง และประกาศจากแอดมินในหน้าเดียว รองรับทั้งมือถือและเดสก์ท็อป":
    "Muestra usuarios, reservas y anuncios del admin en una sola vista para móvil y escritorio.",
  "สรุประบบ": "Resumen del sistema",
  "สมาชิกทั้งหมด": "Miembros totales",
  "ยืนยันแล้ว": "Verificados",
  "จองห้อง": "Reserva de sala",
  "จองอุปกรณ์": "Reserva de equipo",
  "ประกาศ / ข่าวสาร": "Anuncios / Noticias",
  "กิจกรรมล่าสุด": "Actividad reciente",
  "จองข้อมูลการใช้อุปกรณ์แลป": "Reserva de equipo de laboratorio",
  "ระบุรายการ จำนวน และช่วงวันที่ใช้งาน เพื่อวางแผนการเตรียมอุปกรณ์":
    "Indica equipo, cantidad y fecha para planificar la preparación.",
  "แบบฟอร์มจองอุปกรณ์": "Formulario de reserva de equipo",
  "รายการอุปกรณ์": "Equipo",
  "จำนวน": "Cantidad",
  "วันที่ต้องการใช้": "Fecha de uso",
  "รายละเอียดเพิ่มเติม": "Detalles",
  "บันทึกการจองอุปกรณ์": "Guardar reserva de equipo",
  "เงื่อนไขเบื้องต้น": "Condiciones básicas",
  "สมัครสมาชิกระบบแลป": "Registro del sistema de laboratorio",
  "ฟอร์มสมัครสมาชิก": "Formulario de registro",
  "ชื่อ-นามสกุล": "Nombre completo",
  "ชื่อผู้ใช้": "Usuario",
  "อีเมล": "Correo",
  "รหัสผ่าน": "Contraseña",
  "สมัครสมาชิก": "Registrarse",
  "เข้าสู่โปรแกรมจัดการแลป": "Iniciar sesión en el sistema de laboratorio",
  "ฟอร์มเข้าสู่ระบบ": "Formulario de inicio de sesión",
  "ชื่อผู้ใช้ หรือ อีเมล": "Usuario o correo",
  "เข้าสู่ระบบ": "Iniciar sesión",
  "ออกจากระบบ": "Cerrar sesión",
  "แผงจัดการแอดมิน": "Panel de administración",
  "เพิ่มประกาศ / ข่าวสาร": "Agregar anuncio / noticia",
  "ประเภท": "Tipo",
  "หัวข้อ": "Título",
  "รายละเอียด": "Contenido",
  "บันทึกประกาศ": "Guardar anuncio",
  "รายการประกาศ": "Lista de anuncios",
  "อนุมัติการจองห้อง": "Aprobar reservas de sala",
  "จัดการสิทธิ์แอดมิน": "Gestionar permisos de admin",
  "ไม่สามารถเข้าถึงหน้านี้": "No se puede acceder a esta página",
  "รูปภาพโพสต์": "Imagen de la publicación",
  "ซูมภาพ": "Zoom",
  "เลื่อนแนวนอน": "Mover horizontal",
  "เลื่อนแนวตั้ง": "Mover vertical",
  "ครอปรูป": "Recortar imagen",
  "ยังไม่ได้เลือกรูป": "Aún no se seleccionó imagen",
};

const staticLocalized = {
  en: staticEn,
  zh: staticZh,
  es: staticEs,
};
const originalTextNodes = new WeakMap();

const byId = (id) => document.getElementById(id);

const pageAliasMap = {
  "": "index.html",
  "/": "index.html",
  index: "index.html",
  "index.html": "index.html",
  rooms: "rooms.html",
  "rooms.html": "rooms.html",
  equipment: "equipment.html",
  "equipment.html": "equipment.html",
  login: "login.html",
  "login.html": "login.html",
  register: "register.html",
  "register.html": "register.html",
  verify: "verify.html",
  "verify.html": "verify.html",
  profile: "profile.html",
  "profile.html": "profile.html",
  admin: "admin.html",
  "admin.html": "admin.html",
};

const getCurrentPage = () => {
  const raw = (location.pathname.split("/").pop() || "").toLowerCase();
  return pageAliasMap[raw] || raw || "index.html";
};

const isCurrentPage = (pageName) => getCurrentPage() === pageName;

const defaultHomeInfo = {
  orgName: "ชมรมกีฬา มหาวิทยาลัยเทคโนโลยีสุรนารี",
  address: "มหาวิทยาลัยเทคโนโลยีสุรนารี 111 ถ.มหาวิทยาลัย ต.สุรนารี อ.เมืองนครราชสีมา 30000",
  contactFacebook: "ชมรมกีฬา มทส.",
  contactInstagram: "SUATHCTGI",
  contactPhone: "08 2571 3564",
  units: ["ชมรมกีฬา มทส.", "สนามกีฬา", "สนามสุรพลกีฬาสถาน"],
  visitorsTotal: 246,
  visitorsToday: 17,
  visitorsDate: new Date().toISOString().slice(0, 10),
  mapUrl:
    "https://www.google.com/maps?q=Suranaree%20University%20of%20Technology&output=embed",
  managerName: "Wave Anantachai",
  managerRole: "นักกีฬา มทส.",
  managerImage: "image/IconLab.png",
  managerVisible: true,
};

const defaultResponsibleStaff = [
  {
    id: "staff-1",
    name: "อ.ผู้ดูแล Lab-F11",
    email: "labf11@univ.ac.th",
    image: "image/IconLab.png",
  },
  {
    id: "staff-2",
    name: "เจ้าหน้าที่ห้องปฏิบัติการ",
    email: "labstaff@univ.ac.th",
    image: "image/IconLab.png",
  },
];

const defaultEquipmentItems = [
  { id: "eq-1", name: "Microscope", image: "image/IconLab.png", stock: 3, type: "งานวิทยาศาสตร์" },
  { id: "eq-2", name: "Oscilloscope", image: "image/IconLab.png", stock: 3, type: "งานไฟฟ้า" },
  { id: "eq-3", name: "3D Printer", image: "image/IconLab.png", stock: 2, type: "งานเครื่องกล" },
  { id: "eq-4", name: "Sensor Kit", image: "image/IconLab.png", stock: 5, type: "งานไฟฟ้า" },
];

const defaultEquipmentTypes = ["งานวิทยาศาสตร์", "งานไฟฟ้า", "งานไม้", "งานเครื่องกล"];

const load = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });

const getLang = () => {
  const lang = localStorage.getItem(storageKeys.lang);
  return lang === "en" ? "en" : "th";
};

const t = (key, vars = {}) => {
  const lang = getLang();
  const dict = i18n[lang] || i18n.th;
  let out = dict[key] || i18n.en[key] || i18n.th[key] || key;
  Object.keys(vars).forEach((k) => {
    out = out.replaceAll(`{{${k}}}`, String(vars[k]));
  });
  return out;
};

const localeByLang = () => {
  return getLang() === "th" ? "th-TH" : "en-US";
};

const setNotice = (el, message, type = "ok") => {
  if (!el) return;
  el.hidden = false;
  el.className = `notice ${type}`;
  el.textContent = message;
};

const cropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};

const getCropFrame = (canvas) => {
  const frameW = canvas.width * 0.74;
  const frameH = frameW * (9 / 16);
  const x = (canvas.width - frameW) / 2;
  const y = (canvas.height - frameH) / 2;
  return { x, y, w: frameW, h: frameH };
};

const drawCropCanvas = () => {
  const canvas = byId("cropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f7fbfc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!cropState.image) {
    ctx.fillStyle = "#8a97a5";
    ctx.font = "14px Nunito";
    ctx.fillText("No Image", 12, 24);
    return;
  }

  const img = cropState.image;
  const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const drawScale = baseScale * cropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const dx = (canvas.width - drawW) / 2 + cropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + cropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);

  const frame = getCropFrame(canvas);
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.fill("evenodd");
  ctx.strokeStyle = "#ff8f2b";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
};

const createCroppedDataUrl = () => {
  const canvas = byId("cropCanvas");
  if (!canvas || !cropState.image) return "";
  const frame = getCropFrame(canvas);
  const img = cropState.image;

  const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const drawScale = baseScale * cropState.zoom;
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;
  const dx = (canvas.width - drawW) / 2 + cropState.offsetX;
  const dy = (canvas.height - drawH) / 2 + cropState.offsetY;

  let sx = (frame.x - dx) / drawScale;
  let sy = (frame.y - dy) / drawScale;
  let sw = frame.w / drawScale;
  let sh = frame.h / drawScale;

  sx = Math.max(0, sx);
  sy = Math.max(0, sy);
  if (sx + sw > img.width) sw = img.width - sx;
  if (sy + sh > img.height) sh = img.height - sy;
  if (sw <= 0 || sh <= 0) return "";

  const out = document.createElement("canvas");
  out.width = 800;
  out.height = 450;
  const outCtx = out.getContext("2d");
  if (!outCtx) return "";
  outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.9);
};

const setupCropTool = () => {
  const fileInput = byId("announceImage");
  const zoom = byId("cropZoom");
  const x = byId("cropX");
  const y = byId("cropY");
  const applyBtn = byId("applyCropBtn");
  const status = byId("cropStatus");
  if (!fileInput || !zoom || !x || !y || !applyBtn || !status) return;

  const setStatus = (key) => {
    status.textContent = t(key);
  };

  const updateFromSliders = () => {
    cropState.zoom = Number(zoom.value);
    cropState.offsetX = Number(x.value);
    cropState.offsetY = Number(y.value);
    drawCropCanvas();
  };

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    cropState.croppedDataUrl = "";
    if (!file) {
      cropState.image = null;
      drawCropCanvas();
      setStatus("cropEmpty");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        cropState.image = img;
        cropState.zoom = 1;
        cropState.offsetX = 0;
        cropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawCropCanvas();
        setStatus("cropPending");
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  zoom.addEventListener("input", updateFromSliders);
  x.addEventListener("input", updateFromSliders);
  y.addEventListener("input", updateFromSliders);

  applyBtn.addEventListener("click", () => {
    cropState.croppedDataUrl = createCroppedDataUrl();
    if (cropState.croppedDataUrl) {
      setStatus("cropReady");
    } else {
      setStatus("imageRequired");
    }
  });

  drawCropCanvas();
  setStatus("cropEmpty");
};

const refreshCropStatusByState = () => {
  const status = byId("cropStatus");
  if (!status) return;
  if (cropState.croppedDataUrl) {
    status.textContent = t("cropReady");
    return;
  }
  if (cropState.image) {
    status.textContent = t("cropPending");
    return;
  }
  status.textContent = t("cropEmpty");
};

const applyTranslations = () => {
  const lang = getLang();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });

  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    const key = el.getAttribute("data-i18n-value");
    if (!key) return;
    if ("value" in el) el.value = t(key);
    else el.setAttribute("value", t(key));
  });

  const titleMap = {
    "index.html": { th: "LabFlow | หน้าหลัก", en: "LabFlow | Home", zh: "LabFlow | 主页", es: "LabFlow | Inicio" },
    "rooms.html": { th: "LabFlow | จองห้อง", en: "LabFlow | Room Booking", zh: "LabFlow | 房间预约", es: "LabFlow | Reserva de sala" },
    "equipment.html": { th: "LabFlow | จองอุปกรณ์", en: "LabFlow | Equipment Booking", zh: "LabFlow | 设备预约", es: "LabFlow | Reserva de equipo" },
    "register.html": { th: "LabFlow | สมัครสมาชิก", en: "LabFlow | Register", zh: "LabFlow | 注册", es: "LabFlow | Registro" },
    "verify.html": { th: "LabFlow | ยืนยันบัญชี", en: "LabFlow | Verify", zh: "LabFlow | 验证", es: "LabFlow | Verificar" },
    "login.html": { th: "LabFlow | เข้าสู่ระบบ", en: "LabFlow | Login", zh: "LabFlow | 登录", es: "LabFlow | Iniciar sesión" },
    "admin.html": { th: "LabFlow | แอดมิน", en: "LabFlow | Admin", zh: "LabFlow | 管理员", es: "LabFlow | Admin" },
    "profile.html": { th: "LabFlow | โปรไฟล์", en: "LabFlow | Profile", zh: "LabFlow | 个人资料", es: "LabFlow | Perfil" },
  };
  const page = getCurrentPage();
  if (titleMap[page]) {
    document.title = titleMap[page][lang];
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    const raw = node.nodeValue || "";
    const trimmed = raw.trim();
    if (
      parent &&
      trimmed &&
      !parent.closest("[data-i18n]") &&
      !parent.closest("script") &&
      !parent.closest("style")
    ) {
      const source = originalTextNodes.get(node) || trimmed;
      if (!originalTextNodes.has(node)) originalTextNodes.set(node, source);
      if (lang === "th") {
        node.nodeValue = raw.replace(trimmed, source);
      } else {
        const map = staticLocalized[lang] || staticLocalized.en;
        const translated = map[source] || staticLocalized.en[source] || source;
        node.nodeValue = raw.replace(trimmed, translated);
      }
    }
    node = walker.nextNode();
  }

  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((el) => {
    if (el.hasAttribute("data-i18n-placeholder")) return;
    const placeholder = el.getAttribute("placeholder") || "";
    if (!placeholder) return;
    if (!el.dataset.thPlaceholder) el.dataset.thPlaceholder = placeholder;
    if (lang === "th") {
      el.setAttribute("placeholder", el.dataset.thPlaceholder);
      return;
    }
    const map = staticLocalized[lang] || staticLocalized.en;
    if (map[el.dataset.thPlaceholder]) {
      el.setAttribute("placeholder", map[el.dataset.thPlaceholder]);
      return;
    }
    if (lang !== "en" && staticLocalized.en[el.dataset.thPlaceholder]) {
      el.setAttribute("placeholder", staticLocalized.en[el.dataset.thPlaceholder]);
    }
  });
};

const setupLanguageSelector = () => {
  const selects = document.querySelectorAll("#languageSelect");
  if (!selects.length) return;
  selects.forEach((sel) => {
    sel.value = getLang();
    sel.addEventListener("change", (e) => {
      const nextLang = e.target.value === "en" ? "en" : "th";
      localStorage.setItem(storageKeys.lang, nextLang);
      applyTranslations();
      renderDashboard();
      renderAnnouncements();
      renderRoomApproval();
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderAdminEquipmentBorrowSummary();
      renderBroadcastRecipientList();
      renderAdminAnnouncements();
      renderEquipmentTypeFilterOptions();
      refreshEquipmentFilterLabels();
      refreshSessionLabel();
      ensureAdminAccess();
      refreshCropStatusByState();
      updateBookingAuthUI();
      updateNavAuthState();
      setupAuthNav();
    });
  });
};

const activeNav = () => {
  const path = getCurrentPage();
  document.querySelectorAll(".nav a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
};

const performLogout = ({ redirect = true } = {}) => {
  localStorage.removeItem(storageKeys.session);
  setupAdminNav();
  setupAuthNav();
  refreshSessionLabel();
  lockAdminUiImmediately();
  ensureAdminAccess();
  updateBookingAuthUI();
  updateNavAuthState();
  renderAnnouncements();
  if (redirect) {
    const page = location.pathname.split("/").pop() || "index.html";
    if (page !== "login.html") {
      location.href = "login.html";
    }
  }
};

const updateNavAuthState = () => {
  const user = getCurrentUser();
  const authLinks = Array.from(document.querySelectorAll('.nav a[data-i18n="navLogin"]'));
  authLinks.forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.textContent = user ? t("navLogout") : t("navLogin");
    link.classList.toggle("logout-pill", Boolean(user));
    const nav = link.closest(".nav");
    const profileLink = nav?.querySelector('a[href="profile.html"]');
    if (user && nav && profileLink instanceof HTMLElement) {
      nav.insertBefore(profileLink, link);
    }
    if (!link.dataset.logoutBound) {
      link.dataset.logoutBound = "1";
      link.addEventListener("click", (e) => {
        if (!getCurrentUser()) return;
        e.preventDefault();
        performLogout({ redirect: true });
      });
    }
  });
};

const setFooterYear = () => {
  const yearNode = byId("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
};

const getSession = () => load(storageKeys.session, null);

const getUsers = () => load(storageKeys.users);

const getRoomQuota = (user) => {
  const daily = Math.max(1, Number(user?.roomQuotaDaily || 1));
  const weekly = Math.max(1, Number(user?.roomQuotaWeekly || 3));
  return { daily, weekly };
};

const getCurrentUser = () => {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.username === session.username) || null;
};

const roleLabel = (role) => (role === "admin" ? t("roleAdmin") : t("roleUser"));
const statusLabel = (status) =>
  status === "approved"
    ? t("statusApproved")
    : status === "rejected"
      ? t("statusRejected")
      : t("statusPending");
const statusClass = (status) =>
  status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";

const toBookingStartTimestamp = (booking) => {
  const startAt = parseBookingStartAt(booking);
  return startAt ? startAt.getTime() : 0;
};

const sortRoomBookingsByUsageDesc = (list = []) =>
  [...list].sort((a, b) => {
    const diff = toBookingStartTimestamp(b) - toBookingStartTimestamp(a);
    if (diff !== 0) return diff;
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });

const isAdminSession = () => {
  const user = getCurrentUser();
  return Boolean(user && user.role === "admin");
};

const lockAdminUiImmediately = () => {
  byId("adminPanel") && (byId("adminPanel").hidden = true);
  byId("adminGate") && (byId("adminGate").hidden = false);
  byId("equipmentAdminTools") && (byId("equipmentAdminTools").hidden = true);
  byId("labBottomAdminTools") && (byId("labBottomAdminTools").hidden = true);
};

const requireAdminAction = () => {
  if (isAdminSession()) return true;
  lockAdminUiImmediately();
  ensureAdminAccess();
  return false;
};

const setupAdminNav = () => {
  const adminLinks = document.querySelectorAll('.nav a[href="admin.html"], .admin-only');
  if (!adminLinks.length) return;
  const canShow = isAdminSession();
  adminLinks.forEach((link) => {
    link.hidden = !canShow;
  });
};

const setupAuthNav = () => {
  const authLinks = document.querySelectorAll('.nav a[href="profile.html"], .auth-only');
  if (!authLinks.length) return;
  const isLoggedIn = Boolean(getCurrentUser());
  authLinks.forEach((link) => {
    link.hidden = !isLoggedIn;
  });
};

const ensureAdminAccess = () => {
  const page = getCurrentPage();
  if (page === "profile.html" && !getCurrentUser()) {
    location.href = "login.html";
    return;
  }
  if (page === "verify.html" && !isAdminSession()) {
    location.href = "login.html";
    return;
  }
  if (page === "admin.html" && !isAdminSession()) {
    location.href = "login.html";
    return;
  }
  if (page !== "admin.html") return;

  const gate = byId("adminGate");
  const panel = byId("adminPanel");

  if (isAdminSession()) {
    if (gate) gate.hidden = true;
    if (panel) panel.hidden = false;
    return;
  }

  if (gate) {
    gate.hidden = false;
    const p = gate.querySelector("p");
    if (p) p.textContent = t("accessDenied");
  }
  if (panel) panel.hidden = true;
};

const setupClientHardening = () => {
  const debugEnabled = localStorage.getItem("lab_debug") === "1";
  if (!debugEnabled) {
    const noop = () => {};
    try {
      console.log = noop;
      console.info = noop;
      console.debug = noop;
    } catch {
      // ignore
    }
  }
  if (document.body?.dataset.clientHardened === "1") return;
  if (document.body) document.body.dataset.clientHardened = "1";
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const key = String(e.key || "").toLowerCase();
    const block =
      key === "f12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
      (e.ctrlKey && key === "u");
    if (block) e.preventDefault();
  });
};

const seedHomeInfo = () => {
  const exists = localStorage.getItem(storageKeys.homeInfo);
  if (exists) return;
  save(storageKeys.homeInfo, defaultHomeInfo);
};

const seedResponsibleStaff = () => {
  const exists = localStorage.getItem(storageKeys.responsibleStaff);
  if (exists) return;
  save(storageKeys.responsibleStaff, defaultResponsibleStaff);
};

const seedEquipmentItems = () => {
  const exists = localStorage.getItem(storageKeys.equipmentItems);
  if (exists) return;
  save(storageKeys.equipmentItems, defaultEquipmentItems);
};

const seedEquipmentTypes = () => {
  const exists = localStorage.getItem(storageKeys.equipmentTypes);
  if (exists) return;
  save(storageKeys.equipmentTypes, defaultEquipmentTypes);
};

const normalizeEquipmentBookingsData = () => {
  const list = load(storageKeys.equipmentBookings, []);
  if (!Array.isArray(list) || !list.length) return;
  const staff = getResponsibleStaff();
  const defaultResponsibleId = staff[0]?.id || "";
  const items = normalizeEquipmentItems();
  let changed = false;
  const normalized = list.map((b) => {
    const next = { ...b };
    if (!next.bookingId) {
      next.bookingId = `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      changed = true;
    }
    if (!next.room) {
      next.room = "Lab-F11";
      changed = true;
    }
    if (!next.returnStatus) {
      next.returnStatus = "borrowed";
      changed = true;
    }
    if (!next.responsibleId) {
      next.responsibleId = defaultResponsibleId;
      changed = true;
    }
    if (!next.itemId && next.item) {
      const hit = items.find((i) => i.name === next.item);
      if (hit) {
        next.itemId = hit.id;
        changed = true;
      }
    }
    return next;
  });
  if (changed) save(storageKeys.equipmentBookings, normalized);
};

const migrateLegacyData = () => {
  const targetVersion = 3;
  const meta = load(storageKeys.meta, { version: 0 });
  if (Number(meta.version || 0) >= targetVersion) return;

  const staff = load(storageKeys.responsibleStaff, defaultResponsibleStaff);
  const defaultResponsibleId = staff[0]?.id || "";

  const roomBookings = load(storageKeys.roomBookings, []).map((b) => {
    const requesterName = b.requesterName || b.name || "";
    const participantCount =
      Number(
        b.participantCount ||
        [requesterName, b.member1 || "", b.member2 || ""].filter(Boolean).length ||
        1
      );
    return {
      ...b,
      requesterName,
      name: requesterName,
      room: b.room || "Lab-F11",
      bookingId: b.bookingId || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      participantCount,
      responsibleId: b.responsibleId || defaultResponsibleId,
      status: b.status || "pending",
    };
  });
  save(storageKeys.roomBookings, roomBookings);

  const users = load(storageKeys.users, []).map((u) => ({
    ...u,
    studentId: u.studentId || "",
    year: u.year || "",
    school: u.school || "",
    major: u.major || "",
    phone: u.phone || "",
    profileImage: u.profileImage || "",
  }));
  save(storageKeys.users, users);

  const equipmentBookings = load(storageKeys.equipmentBookings, []).map((b) => ({
    ...b,
    bookingId: b.bookingId || `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timeSlot: b.timeSlot || "",
    room: b.room || "Lab-F11",
    responsibleId: b.responsibleId || defaultResponsibleId,
    returnStatus: b.returnStatus || "borrowed",
  }));
  save(storageKeys.equipmentBookings, equipmentBookings);

  const items = load(storageKeys.equipmentItems, []);
  if (!Array.isArray(items) || !items.length) {
    save(storageKeys.equipmentItems, defaultEquipmentItems);
  } else {
    save(
      storageKeys.equipmentItems,
      items.map((it, idx) => ({
        id: it.id || `eq-${idx + 1}`,
        name: it.name || `Item ${idx + 1}`,
        image: it.image || "image/IconLab.png",
        stock: Math.max(1, Number(it.stock || 1)),
        type: it.type || "ทั่วไป",
      }))
    );
  }

  const types = load(storageKeys.equipmentTypes, []);
  if (!Array.isArray(types) || !types.length) {
    save(storageKeys.equipmentTypes, defaultEquipmentTypes);
  } else {
    const normalizedTypes = [...new Set(types.map((v) => String(v || "").trim()).filter(Boolean))];
    if (!normalizedTypes.length) normalizedTypes.push(...defaultEquipmentTypes);
    save(storageKeys.equipmentTypes, normalizedTypes);
  }

  save(storageKeys.meta, { version: targetVersion, migratedAt: new Date().toISOString() });
};

const syncResponsibleApprovals = async () => {
  try {
    const res = await fetch('/api/confirmed-bookings');
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.items)) return;
    const map = new Map(body.items.map((i) => [i.bookingId, i]));
    const list = load(storageKeys.roomBookings, []);
    let changed = false;
    list.forEach((b) => {
      const hit = map.get(b.bookingId);
      if (!hit) return;
      if (b.status !== hit.status) {
        b.status = hit.status;
        if (hit.status === 'approved') {
          b.approvedBy = hit.approvedBy || 'responsible';
          b.approvedAt = hit.approvedAt || new Date().toISOString();
        } else if (hit.status === 'rejected') {
          b.rejectedBy = hit.rejectedBy || 'responsible';
          b.rejectedAt = hit.rejectedAt || new Date().toISOString();
        }
        changed = true;
      }
    });
    if (changed) save(storageKeys.roomBookings, list);
  } catch {
    // API may be unavailable when static host is used.
  }
};

const updateVisitorCounters = () => {
  const page = location.pathname.split("/").pop() || "index.html";
  if (page !== "index.html") return;

  const today = new Date().toISOString().slice(0, 10);
  const marker = `lab_visit_counted_${today}`;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };

  if (info.visitorsDate !== today) {
    info.visitorsDate = today;
    info.visitorsToday = 0;
  }

  if (!sessionStorage.getItem(marker)) {
    info.visitorsTotal = Number(info.visitorsTotal || 0) + 1;
    info.visitorsToday = Number(info.visitorsToday || 0) + 1;
    sessionStorage.setItem(marker, "1");
    save(storageKeys.homeInfo, info);
  }
};

const seedAdmin = () => {
  const users = load(storageKeys.users);
  const adminUsername = "Anantachai2000";
  const hasAdmin = users.some((u) => u.username === adminUsername);
  if (hasAdmin) return;

  users.push({
    name: "System Admin",
    username: adminUsername,
    email: "anantachai2000@labflow.local",
    password: "Wave_862543",
    verified: true,
    verificationCode: "000000",
    role: "admin",
    roomQuotaDaily: 1,
    roomQuotaWeekly: 3,
  });
  save(storageKeys.users, users);
};

const normalizeUsers = () => {
  const users = load(storageKeys.users);
  const normalized = users.map((u) => ({
    ...u,
    username: u.username || (u.email ? u.email.split("@")[0] : "user"),
    role: u.role || "user",
    roomQuotaDaily: Math.max(1, Number(u.roomQuotaDaily || 1)),
    roomQuotaWeekly: Math.max(1, Number(u.roomQuotaWeekly || 3)),
  }));
  save(storageKeys.users, normalized);
};

let announcementEditorSaveHandler = null;

const normalizeAnnouncementType = (type) => {
  const raw = String(type || "").trim().toLowerCase();
  if (raw === "news" || raw === "ข่าวสาร") return "news";
  return "announcement";
};

const announcementTypeLabel = (type) =>
  normalizeAnnouncementType(type) === "news"
    ? t("announcementTypeNews")
    : t("announcementTypeAnnouncement");

const setAnnouncementEditorPreview = (src) => {
  const preview = byId("announcementEditorImagePreview");
  if (!preview) return;
  const value = String(src || "").trim();
  preview.hidden = !value;
  if (value) preview.src = value;
};

const closeAnnouncementEditor = () => {
  const modal = byId("announcementEditorModal");
  const form = byId("announcementEditorForm");
  const notice = byId("announcementEditorNotice");
  if (modal) modal.hidden = true;
  if (form) form.reset();
  if (notice) notice.hidden = true;
  setAnnouncementEditorPreview("");
  announcementEditorSaveHandler = null;
};

const openAnnouncementEditor = ({ mode = "create", announcement = null, onSave }) => {
  const modal = byId("announcementEditorModal");
  const title = byId("announcementEditorTitle");
  const type = byId("announcementEditorType");
  const titleInput = byId("announcementEditorTitleInput");
  const contentInput = byId("announcementEditorContentInput");
  const imageUrlInput = byId("announcementEditorImageUrlInput");
  const saveBtn = byId("announcementEditorSaveBtn");
  const closeBtn = byId("announcementEditorCloseBtn");
  const notice = byId("announcementEditorNotice");
  if (!modal || !type || !titleInput || !contentInput || !imageUrlInput || !title || !saveBtn) return;

  type.innerHTML = `
    <option value="announcement">${t("announcementTypeAnnouncement")}</option>
    <option value="news">${t("announcementTypeNews")}</option>
  `;
  title.textContent =
    mode === "edit" ? t("announcementEditorEditTitle") : t("announcementEditorCreateTitle");
  saveBtn.textContent = t("announcementEditorSaveBtn");
  if (closeBtn) closeBtn.textContent = t("announcementEditorCancelBtn");
  announcementEditorSaveHandler = onSave;
  if (notice) notice.hidden = true;
  if (announcement) {
    type.value = normalizeAnnouncementType(announcement.type);
    titleInput.value = announcement.title || "";
    contentInput.value = announcement.content || "";
    imageUrlInput.value = announcement.image || "";
    setAnnouncementEditorPreview(announcement.image || "");
  } else {
    type.value = "announcement";
    titleInput.value = "";
    contentInput.value = "";
    imageUrlInput.value = "";
    setAnnouncementEditorPreview("");
  }

  modal.hidden = false;
};

const setupAnnouncementEditor = () => {
  const modal = byId("announcementEditorModal");
  const form = byId("announcementEditorForm");
  if (!modal || !form || form.dataset.bound) return;
  form.dataset.bound = "1";

  const cancelBtn = byId("announcementEditorCancelBtn");
  const closeBtn = byId("announcementEditorCloseBtn");
  const imageUrlInput = byId("announcementEditorImageUrlInput");
  const imageFileInput = byId("announcementEditorImageFileInput");
  const notice = byId("announcementEditorNotice");

  cancelBtn?.addEventListener("click", closeAnnouncementEditor);
  closeBtn?.addEventListener("click", closeAnnouncementEditor);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAnnouncementEditor();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeAnnouncementEditor();
  });

  imageUrlInput?.addEventListener("input", () => {
    setAnnouncementEditorPreview(imageUrlInput.value);
  });

  imageFileInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file || !imageUrlInput) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      imageUrlInput.value = dataUrl;
      setAnnouncementEditorPreview(dataUrl);
    } catch {
      // Keep existing image URL if file read fails.
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const typeValue = byId("announcementEditorType")?.value || "announcement";
    const titleValue = byId("announcementEditorTitleInput")?.value?.trim() || "";
    const contentValue = byId("announcementEditorContentInput")?.value?.trim() || "";
    const imageValue = byId("announcementEditorImageUrlInput")?.value?.trim() || "";
    if (!titleValue || !contentValue) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (typeof announcementEditorSaveHandler === "function") {
      announcementEditorSaveHandler({
        type: normalizeAnnouncementType(typeValue),
        title: titleValue,
        content: contentValue,
        image: imageValue,
      });
    }
    closeAnnouncementEditor();
  });
};

const setAnnouncementCardExpanded = (card, expanded) => {
  if (!(card instanceof HTMLElement)) return;
  const textNode = card.querySelector(".announcement-content");
  if (!(textNode instanceof HTMLElement)) return;
  const encodedFull = card.dataset.annFull || "";
  const encodedCompact = card.dataset.annCompact || "";
  const isLong = card.dataset.annLong === "1";
  const full = decodeURIComponent(encodedFull || "");
  const compact = decodeURIComponent(encodedCompact || "");
  card.classList.toggle("expanded", expanded);
  if (expanded) {
    textNode.className = "announcement-full announcement-content";
    textNode.textContent = full;
    const collapse = document.createElement("p");
    collapse.className = "announcement-collapse";
    collapse.textContent = t("announcementCollapse");
    const existing = card.querySelector(".announcement-collapse");
    if (existing) existing.remove();
    const body = card.querySelector(".announcement-body");
    body?.appendChild(collapse);
  } else {
    textNode.className = "announcement-excerpt announcement-content";
    textNode.innerHTML = `${compact}${isLong ? ` <span class="announcement-readmore">${t("announcementReadMore")}</span>` : ""}`;
    const existing = card.querySelector(".announcement-collapse");
    if (existing) existing.remove();
  }
};

const renderAnnouncements = () => {
  const target = byId("announcementList");
  if (!target) return;
  const loadMoreBtn = byId("announcementLoadMore");
  const quickAddBtn = byId("announcementQuickAdd");
  const countLabel = byId("announcementCountLabel");
  const page = location.pathname.split("/").pop() || "index.html";
  const canManage = page === "index.html" && isAdminSession();

  const raw = load(storageKeys.announcements, []);
  let changed = false;
  const normalized = raw.map((a, idx) => {
    if (a.id) return a;
    changed = true;
    return { ...a, id: `ann-${a.createdAt || Date.now()}-${idx}` };
  });
  if (changed) save(storageKeys.announcements, normalized);
  const announcements = normalized.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const step = 6;
  const stateKey = "__announcementVisibleCount";
  const expandedKey = "__announcementExpandedId";
  if (typeof window[stateKey] !== "number" || window[stateKey] < step) {
    window[stateKey] = step;
  }
  const visibleCount = Math.min(window[stateKey], announcements.length);
  const visible = announcements.slice(0, visibleCount);

  target.innerHTML = visible.length
    ? visible
        .map((a, idx) => {
          const id = String(a.id || a.createdAt || idx);
          const expanded = window[expandedKey] === id;
          const content = String(a.content || "");
          const isLong = content.length > 140;
          const compact = isLong ? `${content.slice(0, 140).trim()}...` : content;
          return `<article class="announcement-card ${expanded ? "expanded" : ""} ${a.image ? "has-image" : "no-image"}" data-announcement-id="${id}" data-ann-full="${encodeURIComponent(content)}" data-ann-compact="${encodeURIComponent(compact)}" data-ann-long="${isLong ? "1" : "0"}">
              ${a.image ? `<img class="feed-image" src="${a.image}" alt="${a.title}" />` : ""}
              <div class="announcement-body">
                <p class="feed-meta">${announcementTypeLabel(a.type)} · ${new Date(a.createdAt).toLocaleString(localeByLang())}</p>
                <h4>${a.title}</h4>
                <p class="${expanded ? "announcement-full" : "announcement-excerpt"} announcement-content">
                  ${expanded ? content : compact}
                  ${!expanded && isLong ? ` <span class="announcement-readmore">${t("announcementReadMore")}</span>` : ""}
                </p>
                ${expanded ? `<p class="announcement-collapse">${t("announcementCollapse")}</p>` : ""}
                ${
                  canManage
                    ? `<div class="announcement-actions">
                        <button type="button" class="btn-small" data-ann-action="edit" data-announcement-id="${id}">${t("announcementEditBtn")}</button>
                        <button type="button" class="btn-small danger" data-ann-action="delete" data-announcement-id="${id}">${t("deleteBtn")}</button>
                      </div>`
                    : ""
                }
              </div>
            </article>`;
        })
        .join("")
    : `<p class="muted">${t("announcementEmpty")}</p>`;

  if (!target.dataset.bound) {
    target.dataset.bound = "1";
    target.addEventListener("click", (e) => {
      const node = e.target;
      if (!(node instanceof HTMLElement)) return;
      const actionBtn = node.closest("[data-ann-action]");
      if (actionBtn instanceof HTMLElement) {
        if (!isAdminSession()) return;
        const action = String(actionBtn.dataset.annAction || "");
        const id = String(actionBtn.dataset.announcementId || "");
        if (!id) return;
        const list = load(storageKeys.announcements, []);
        const index = list.findIndex((a) => String(a.id || "") === id || String(a.createdAt || "") === id);
        if (index < 0) return;
        if (action === "delete") {
          if (!window.confirm(t("confirmDeleteAnnouncement"))) return;
          list.splice(index, 1);
          save(storageKeys.announcements, list);
          renderAnnouncements();
          renderAdminAnnouncements();
          return;
        }
        if (action === "edit") {
          const current = list[index];
          openAnnouncementEditor({
            mode: "edit",
            announcement: current,
            onSave: (payload) => {
              list[index] = {
                ...current,
                title: payload.title || current.title || "",
                content: payload.content || current.content || "",
                type: payload.type || current.type || "announcement",
                image: payload.image || "",
                updatedAt: new Date().toISOString(),
              };
              save(storageKeys.announcements, list);
              renderAnnouncements();
              renderAdminAnnouncements();
            },
          });
          return;
        }
      }
      const card = node.closest("[data-announcement-id]");
      if (!(card instanceof HTMLElement)) return;
      const id = String(card.dataset.announcementId || "");
      if (!id) return;
      const currentExpanded = target.querySelector(".announcement-card.expanded");
      const willExpand = window[expandedKey] !== id;
      if (currentExpanded instanceof HTMLElement && currentExpanded !== card) {
        setAnnouncementCardExpanded(currentExpanded, false);
      }
      setAnnouncementCardExpanded(card, willExpand);
      window[expandedKey] = willExpand ? id : "";
    });
  }

  if (countLabel) {
    countLabel.textContent = announcements.length
      ? `${visibleCount}/${announcements.length}`
      : "";
  }
  if (loadMoreBtn) {
    loadMoreBtn.textContent = t("announcementLoadMore");
    loadMoreBtn.hidden = announcements.length <= visibleCount;
    if (!loadMoreBtn.dataset.bound) {
      loadMoreBtn.dataset.bound = "1";
      loadMoreBtn.addEventListener("click", () => {
        window[stateKey] = (window[stateKey] || step) + step;
        renderAnnouncements();
      });
    }
  }
  if (quickAddBtn) {
    quickAddBtn.textContent = t("announcementAddBtn");
    quickAddBtn.hidden = !canManage;
    if (!quickAddBtn.dataset.bound) {
      quickAddBtn.dataset.bound = "1";
      quickAddBtn.addEventListener("click", () => {
        if (!isAdminSession()) return;
        openAnnouncementEditor({
          mode: "create",
          onSave: (payload) => {
            const session = getSession();
            const list = load(storageKeys.announcements, []);
            list.push({
              id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              type: payload.type || "announcement",
              title: payload.title,
              content: payload.content,
              image: payload.image || "",
              createdAt: new Date().toISOString(),
              author: session?.username || "admin",
            });
            save(storageKeys.announcements, list);
            renderAnnouncements();
            renderAdminAnnouncements();
          },
        });
      });
    }
  }
};

const renderDashboard = () => {
  const users = load(storageKeys.users);
  const roomBookings = load(storageKeys.roomBookings);
  const equipmentBookings = load(storageKeys.equipmentBookings);

  const verifiedUsers = users.filter((u) => u.verified).length;
  const pendingRooms = roomBookings.filter((b) => b.status === "pending").length;

  byId("totalUsers") && (byId("totalUsers").textContent = users.length);
  byId("verifiedUsers") && (byId("verifiedUsers").textContent = verifiedUsers);
  byId("roomCount") && (byId("roomCount").textContent = roomBookings.length);
  byId("equipmentCount") && (byId("equipmentCount").textContent = equipmentBookings.length);
  byId("pendingRoomCount") && (byId("pendingRoomCount").textContent = pendingRooms);

  const recentList = byId("recentActivity");
  if (!recentList) return;

  const merged = [
    ...roomBookings.map((b) => ({
      time: b.createdAt,
      text: t("recentRoom", {
        room: b.room,
        date: b.date,
        timeSlot: b.timeSlot,
        status: statusLabel(b.status || "pending"),
      }),
    })),
    ...equipmentBookings.map((b) => ({
      time: b.createdAt,
      text: t("recentEquipment", { item: b.item, quantity: b.quantity }),
    })),
  ]
    .sort((a, b) => (a.time < b.time ? 1 : -1))
    .slice(0, 5);

  recentList.innerHTML = merged.length
    ? merged.map((item) => `<li>${item.text}</li>`).join("")
    : `<li>${t("recentEmpty")}</li>`;
};

const renderHomeBottomInfo = () => {
  const section = byId("labOrgName");
  if (!section) return;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };

  byId("labOrgName").textContent = info.orgName || defaultHomeInfo.orgName;
  byId("labAddress").textContent = info.address || defaultHomeInfo.address;
  byId("labContactFacebook").textContent = info.contactFacebook || "-";
  byId("labContactInstagram").textContent = info.contactInstagram || "-";
  byId("labContactPhone").textContent = info.contactPhone || "-";
  byId("labVisitorsTotal").textContent = t("visitorsTotalText", { count: Number(info.visitorsTotal || 0) });
  byId("labVisitorsToday").textContent = t("visitorsTodayText", { count: Number(info.visitorsToday || 0) });
  byId("labManagerName").textContent = info.managerName || "-";
  byId("labManagerRole").textContent = info.managerRole || "-";
  if (byId("labManagerImage")) {
    byId("labManagerImage").src = info.managerImage || "image/IconLab.png";
  }
  if (byId("labMap")) {
    byId("labMap").src = info.mapUrl || defaultHomeInfo.mapUrl;
  }
  const managerSection = byId("labManagerSection");
  if (managerSection) {
    managerSection.hidden = info.managerVisible === false;
  }
  const units = Array.isArray(info.units) ? info.units : defaultHomeInfo.units;
  if (byId("labUnits")) {
    byId("labUnits").innerHTML = units.length
      ? units.map((u) => `<li>${u}</li>`).join("")
      : "<li>-</li>";
  }
};

const parseBookingStartAt = (booking) => {
  const date = String(booking?.date || "").trim();
  const timeSlotRaw = String(booking?.timeSlot || "").trim();
  if (!date || !timeSlotRaw) return null;
  const startRaw = timeSlotRaw.split("-")[0] || "";
  const cleaned = startRaw
    .replace(/[^\d:.]/g, "")
    .replace(/\./g, ":")
    .trim();
  const [hStr, mStr = "00"] = cleaned.split(":");
  const hh = Number(hStr);
  const mm = Number(mStr);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dt = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const parseBookingEndAt = (booking) => {
  const date = String(booking?.date || "").trim();
  const timeSlotRaw = String(booking?.timeSlot || "").trim();
  if (!date || !timeSlotRaw) return null;
  const endRaw = timeSlotRaw.split("-")[1] || "";
  const cleaned = endRaw
    .replace(/[^\d:.]/g, "")
    .replace(/\./g, ":")
    .trim();
  if (!cleaned) return null;
  const [hStr, mStr = "00"] = cleaned.split(":");
  const hh = Number(hStr);
  const mm = Number(mStr);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const dt = new Date(`${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const isBookingPastEndTime = (booking) => {
  const endAt = parseBookingEndAt(booking);
  if (!endAt) return false;
  return Date.now() > endAt.getTime();
};

const canCancelBookingWithinWindow = (booking, graceMinutes = 15) => {
  const startAt = parseBookingStartAt(booking);
  if (!startAt) return true;
  const cutoff = new Date(startAt.getTime() + graceMinutes * 60 * 1000);
  return Date.now() < cutoff.getTime();
};

const renderProfilePage = () => {
  if (!isCurrentPage("profile.html")) return;
  const user = getCurrentUser();
  if (!user) return;

  const img = byId("profileImage");
  const name = byId("profileName");
  const username = byId("profileUsername");
  const meta = byId("profileMeta");
  if (img) img.src = user.profileImage || "image/IconLab.png";
  if (name) name.textContent = user.name || "-";
  if (username) username.textContent = `${user.username || "-"} | ${user.email || "-"}`;
  if (meta) {
    meta.innerHTML = `
      <p>${t("profileStudentId")}: ${user.studentId || "-"}</p>
      <p>${t("profileYear")}: ${user.year || "-"}</p>
      <p>${t("profileSchool")}: ${user.school || "-"}</p>
      <p>${t("profileMajor")}: ${user.major || "-"}</p>
      <p>${t("profilePhone")}: ${user.phone || "-"}</p>
    `;
  }

  const isMine = (b) =>
    (b.username && b.username === user.username) ||
    (b.email && b.email === user.email) ||
    (b.name && b.name === user.name) ||
    (b.requesterName && b.requesterName === user.name);

  const roomList = load(storageKeys.roomBookings, [])
    .filter(isMine)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const eqList = load(storageKeys.equipmentBookings, [])
    .filter(isMine)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const roomCount = byId("profileRoomCount");
  const eqCount = byId("profileEquipmentCount");
  const todayRoomCountNode = byId("profileTodayRoomCountValue");
  const weekRoomCountNode = byId("profileWeekRoomCountValue");
  const weekQuotaLeftNode = byId("profileWeekQuotaLeftValue");
  if (roomCount) roomCount.textContent = String(roomList.length);
  if (eqCount) eqCount.textContent = String(eqList.length);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentWeek = weekKey(today);
  const quota = getRoomQuota(user);
  const quotaSource = roomList.filter((b) => (b.status || "pending") !== "rejected");
  const todayRoomCount = quotaSource.filter((b) => String(b.date || "") === today).length;
  const weekRoomCount = quotaSource.filter((b) => weekKey(String(b.date || "")) === currentWeek).length;
  const weekQuotaLeft = Math.max(quota.weekly - weekRoomCount, 0);
  if (todayRoomCountNode) todayRoomCountNode.textContent = String(todayRoomCount);
  if (weekRoomCountNode) weekRoomCountNode.textContent = String(weekRoomCount);
  if (weekQuotaLeftNode) weekQuotaLeftNode.textContent = String(weekQuotaLeft);

  const roomWrap = byId("profileRoomList");
  if (roomWrap) {
    roomWrap.innerHTML = roomList.length
      ? roomList
          .map(
            (r) => `<div class="feed-item">
              <p class="feed-meta">${new Date(r.createdAt).toLocaleString(localeByLang())}</p>
              <p><strong>${r.room}</strong> | ${r.date} | ${r.timeSlot}</p>
              <p class="muted">${t("profilePurpose")}: ${r.purpose || "-"}</p>
              <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(r.status || "pending")}">${statusLabel(r.status || "pending")}</span></p>
              ${
                ["pending", "approved"].includes(r.status || "pending") && canCancelBookingWithinWindow(r)
                  ? `<div class="feed-actions-end"><button type="button" class="btn-small danger" data-cancel-room-booking="${r.bookingId || r.createdAt}">${t("cancelRoomBookingBtn")}</button></div>`
                  : ""
              }
            </div>`
          )
          .join("")
      : `<p class="muted">${t("profileNoRoomBookings")}</p>`;

    roomWrap.onclick = (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const bookingId = target.dataset.cancelRoomBooking;
      if (!bookingId) return;
      const selected = roomList.find((b) => String(b.bookingId || b.createdAt) === String(bookingId));
      if (!selected || !canCancelBookingWithinWindow(selected)) return;
      if (!window.confirm(t("confirmCancelRoomBooking"))) return;
      const rooms = load(storageKeys.roomBookings, []);
      const next = rooms.filter((b) => String(b.bookingId || b.createdAt) !== String(bookingId));
      save(storageKeys.roomBookings, next);
      alert(t("cancelSuccess"));
      renderProfilePage();
      renderDashboard();
      renderRoomSlots();
      renderRoomApproval();
    };
  }

  const eqWrap = byId("profileEquipmentList");
  if (eqWrap) {
    const grouped = [];
    const batchMap = new Map();
    eqList.forEach((e) => {
      const status = e.returnStatus || "borrowed";
      const rawBatchId = String(e.returnBatchId || "").trim();
      const legacyBatchId =
        !rawBatchId && status !== "borrowed" && e.returnProofImage && e.returnProofAt
          ? `legacy-${status}-${e.returnProofAt}-${e.returnProofImage.slice(0, 64)}`
          : "";
      const batchId = rawBatchId || legacyBatchId;
      if (!batchId || status === "borrowed") {
        grouped.push({ type: "single", item: e });
        return;
      }
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, { type: "batch", batchId, items: [e] });
        grouped.push(batchMap.get(batchId));
      } else {
        batchMap.get(batchId).items.push(e);
      }
    });

    eqWrap.innerHTML = grouped.length
      ? grouped
          .map((entry) => {
            if (entry.type === "single") {
              const e = entry.item;
              return `<div class="feed-item">
                <p class="feed-meta">${new Date(e.createdAt).toLocaleString(localeByLang())}</p>
                <p><strong>${e.item}</strong> ${t("profileQty")} ${e.quantity}</p>
                <p class="muted">${t("profileStatus")}: <span class="pill ${e.returnStatus === "returned" ? "approved" : e.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(e.returnStatus || "borrowed")}</span></p>
                <p class="muted">${t("profileUsageDate")}: ${e.date}</p>
                <p class="muted">${t("profileDetail")}: ${e.detail || "-"}</p>
                ${
                  e.returnProofImage
                    ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${e.returnProofImage}" alt="return-proof" />`
                    : ""
                }
                ${
                  (e.returnStatus || "borrowed") === "borrowed"
                    ? `<div class="feed-actions-end inline-actions">
                        <button type="button" class="btn-small" data-request-return="${e.bookingId || ""}">${t("equipmentRequestReturnBtn")}</button>
                        ${
                          canCancelBookingWithinWindow(e)
                            ? `<button type="button" class="btn-small danger" data-cancel-equipment-booking="${e.bookingId || e.createdAt}">${t("cancelEquipmentBookingBtn")}</button>`
                            : ""
                        }
                      </div>`
                    : (e.returnStatus || "borrowed") === "return_requested"
                      ? `<div class="feed-actions-end inline-actions">
                          <button type="button" class="btn-small danger" data-cancel-return-request="${e.bookingId || ""}">${t("cancelReturnRequestBtn")}</button>
                          ${
                            canCancelBookingWithinWindow(e)
                              ? `<button type="button" class="btn-small danger" data-cancel-equipment-booking="${e.bookingId || e.createdAt}">${t("cancelEquipmentBookingBtn")}</button>`
                              : ""
                          }
                        </div>`
                      : ""
                }
              </div>`;
            }

            const first = entry.items[0];
            const status = first.returnStatus || "borrowed";
            const totalQty = entry.items.reduce((sum, it) => sum + Math.max(1, Number(it.quantity || 1)), 0);
            const itemList = entry.items
              .map((it) => `<li><strong>${it.item}</strong> ${t("profileQty")} ${it.quantity}</li>`)
              .join("");
            return `<div class="feed-item">
              <p class="feed-meta">${new Date(first.createdAt).toLocaleString(localeByLang())}</p>
              <p><strong>${entry.items.length}</strong> ${t("equipmentBatchItemsLabel")} | ${t("profileQty")} ${t("equipmentTotalQtyLabel")} ${totalQty}</p>
              <ul class="list">${itemList}</ul>
              <p class="muted">${t("profileStatus")}: <span class="pill ${status === "returned" ? "approved" : status === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(status)}</span></p>
              <p class="muted">${t("profileUsageDate")}: ${first.date}</p>
              <p class="muted">${t("profileDetail")}: ${first.detail || "-"}</p>
              ${
                first.returnProofImage
                  ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${first.returnProofImage}" alt="return-proof" />`
                  : ""
              }
              ${
                status === "return_requested"
                  ? `<div class="feed-actions-end inline-actions">
                      <button type="button" class="btn-small danger" data-cancel-return-batch="${entry.batchId}">${t("cancelReturnRequestBtn")}</button>
                    </div>`
                  : ""
              }
            </div>`;
          })
          .join("")
      : `<p class="muted">${t("profileNoEquipmentBookings")}</p>`;

    eqWrap.onclick = async (ev) => {
      const target = ev.target;
      if (!(target instanceof HTMLElement)) return;
      const cancelEquipmentId = target.dataset.cancelEquipmentBooking;
      if (cancelEquipmentId) {
        const selected = eqList.find((b) => String(b.bookingId || b.createdAt) === String(cancelEquipmentId));
        if (!selected || !canCancelBookingWithinWindow(selected)) return;
        if (!window.confirm(t("confirmCancelEquipmentBooking"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        const next = list.filter(
          (b) => String(b.bookingId || b.createdAt) !== String(cancelEquipmentId)
        );
        save(storageKeys.equipmentBookings, next);
        alert(t("cancelSuccess"));
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        renderAdminEquipmentBorrowSummary();
        renderAdminUserProfilePanel();
        return;
      }
      const cancelReturnId = target.dataset.cancelReturnRequest;
      if (cancelReturnId) {
        if (!window.confirm(t("confirmCancelReturnRequest"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        const idx = list.findIndex((b) => String(b.bookingId || b.createdAt) === String(cancelReturnId));
        if (idx >= 0) {
          list[idx].returnStatus = "borrowed";
          delete list[idx].returnRequestedAt;
          save(storageKeys.equipmentBookings, list);
        }
        alert(t("cancelSuccess"));
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        return;
      }
      const cancelReturnBatch = target.dataset.cancelReturnBatch;
      if (cancelReturnBatch) {
        if (!window.confirm(t("confirmCancelReturnRequest"))) return;
        const list = load(storageKeys.equipmentBookings, []);
        let changed = false;
        list.forEach((b) => {
          if (String(b.returnBatchId || "") !== String(cancelReturnBatch)) return;
          if ((b.returnStatus || "borrowed") !== "return_requested") return;
          b.returnStatus = "borrowed";
          delete b.returnRequestedAt;
          changed = true;
        });
        if (changed) {
          save(storageKeys.equipmentBookings, list);
          alert(t("cancelSuccess"));
        }
        renderProfilePage();
        renderDashboard();
        renderEquipmentCatalog();
        return;
      }
      const id = target.dataset.requestReturn;
      if (!id) return;
      await requestEquipmentReturn(id, { askProofInModal: true });
    };
  }
};

const roomSelection = () => ({
  room: byId("roomFixed")?.value?.trim() || "Lab-F11",
  date: byId("roomStatusDate")?.value?.trim() || byId("roomDate")?.value?.trim() || "",
  timeSlot: byId("roomStatusTime")?.value?.trim() || byId("roomTime")?.value?.trim() || "",
});

const roomBookingsBySelection = (selection) =>
  load(storageKeys.roomBookings, []).filter(
    (b) =>
      b.room === selection.room &&
      b.date === selection.date &&
      b.timeSlot === selection.timeSlot
  );

let currentRoomSlotEntries = [];

const isMyRoomBooking = (booking) => {
  const me = getCurrentUser();
  if (!me) return false;
  if (booking.username && booking.username === me.username) return true;
  if (booking.email && booking.email === me.email) return true;
  return Boolean(booking.name && booking.name === me.name);
};

const isBookingOwnedByUser = (booking, user) => {
  if (!user) return false;
  if (booking.username && booking.username === user.username) return true;
  if (booking.email && booking.email === user.email) return true;
  return Boolean((booking.requesterName || booking.name) && (booking.requesterName || booking.name) === user.name);
};

const weekKey = (dateStr) => {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const renderRoomSlots = () => {
  const grid = byId("roomSlotsGrid");
  const summary = byId("roomSlotSummary");
  const detail = byId("roomSlotDetail");
  const dailySummary = byId("roomDailySummary");
  if (!grid) return;

  const selection = roomSelection();
  if (!selection.date || !selection.timeSlot) {
    if (summary) summary.textContent = t("roomSelectHint");
    if (dailySummary) dailySummary.textContent = t("roomDailyHint");
    if (detail) detail.textContent = t("roomHoverHint");
    currentRoomSlotEntries = [];
    grid.innerHTML = Array.from({ length: 20 })
      .map(
        (_, i) =>
          `<div class="room-slot" title="${t("roomSlotTitle", { index: i + 1 })}"><img src="image/userG.png" alt="empty" /></div>`
      )
      .join("");
    return;
  }

  const bookings = roomBookingsBySelection(selection).filter((b) => b.status === "approved");
  const pendingCount = roomBookingsBySelection(selection).filter((b) => b.status !== "approved").length;
  const dayBookings = load(storageKeys.roomBookings, []).filter(
    (b) => b.room === selection.room && b.date === selection.date
  );
  const approvedPerDay = dayBookings
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + Number(b.participantCount || 1), 0);
  const pendingPerDay = dayBookings
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + Number(b.participantCount || 1), 0);
  const dayCapacity = 40;
  const availablePerDay = Math.max(dayCapacity - approvedPerDay, 0);
  const slots = [];
  bookings.forEach((b) => {
    const n = Number(b.participantCount || 1);
    for (let i = 0; i < n; i += 1) {
      slots.push({ mine: isMyRoomBooking(b), booking: b });
      if (slots.length >= 20) break;
    }
  });
  currentRoomSlotEntries = slots;
  if (summary) {
    summary.textContent = t("roomSummaryText", {
      room: selection.room,
      date: selection.date,
      timeSlot: selection.timeSlot,
      approved: slots.length,
      pending: pendingCount,
    });
  }
  if (dailySummary) {
    dailySummary.textContent = t("roomDailySummaryText", {
      date: selection.date,
      booked: approvedPerDay,
      available: availablePerDay,
      pending: pendingPerDay,
    });
  }
  if (detail) detail.textContent = t("roomHoverHint");

  let html = "";
  for (let i = 0; i < 20; i += 1) {
    if (i >= slots.length) {
      html += `<div class="room-slot" data-slot-index="${i}" title="${t("roomSlotEmpty", { index: i + 1 })}"><img src="image/userG.png" alt="empty" /></div>`;
      continue;
    }
    const mine = slots[i].mine;
    const b = slots[i].booking;
    const icon = mine ? "image/userGre.png" : "image/userR.png";
    const owner = b.requesterName || b.name || "-";
    const title = mine
      ? t("roomSlotMineTitle", { index: i + 1, owner })
      : t("roomSlotOtherTitle", { index: i + 1, owner });
    html += `<div class="room-slot" data-slot-index="${i}" title="${title}"><img src="${icon}" alt="${mine ? "mine" : "other"}" /></div>`;
  }
  grid.innerHTML = html;
};

const setupRoomBookingUI = () => {
  const form = byId("roomBookingForm");
  const today = new Date().toISOString().slice(0, 10);
  const syncInputValue = (fromId, toId) => {
    const from = byId(fromId);
    const to = byId(toId);
    if (!from || !to) return;
    to.value = from.value;
  };

  byId("roomStatusDate")?.addEventListener("change", () => {
    syncInputValue("roomStatusDate", "roomDate");
    renderRoomSlots();
  });
  byId("roomStatusTime")?.addEventListener("change", () => {
    syncInputValue("roomStatusTime", "roomTime");
    renderRoomSlots();
  });
  byId("roomDate")?.addEventListener("change", () => {
    syncInputValue("roomDate", "roomStatusDate");
    renderRoomSlots();
  });
  byId("roomTime")?.addEventListener("change", () => {
    syncInputValue("roomTime", "roomStatusTime");
    renderRoomSlots();
  });

  if (!form) {
    const statusDate = byId("roomStatusDate");
    if (statusDate && !statusDate.value) statusDate.value = today;
    renderRoomSlots();
    return;
  }

  const me = getCurrentUser();
  const nameInput = byId("roomRequesterName");
  if (nameInput && me && !nameInput.value) {
    nameInput.value = me.name || me.username;
  }
  const roomDate = byId("roomDate");
  const roomStatusDate = byId("roomStatusDate");
  if (roomDate && !roomDate.value) roomDate.value = today;
  if (roomStatusDate && !roomStatusDate.value) roomStatusDate.value = roomDate?.value || today;
  if (roomDate && roomStatusDate && roomDate.value !== roomStatusDate.value) {
    roomDate.value = roomStatusDate.value;
  }
  if (byId("roomTime") && byId("roomStatusTime") && !byId("roomStatusTime").value) {
    syncInputValue("roomTime", "roomStatusTime");
  }

  byId("roomSlotsGrid")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const slotEl = target.closest("[data-slot-index]");
    if (!(slotEl instanceof HTMLElement)) return;
    const index = Number(slotEl.dataset.slotIndex);
    const detail = byId("roomSlotDetail");
    if (!detail) return;
    const entry = currentRoomSlotEntries[index];
    if (!entry) {
      detail.textContent = t("roomSlotEmptyDetail", { index: index + 1 });
      return;
    }
    const b = entry.booking;
    detail.innerHTML = t("roomSlotDetailFull", {
      index: index + 1,
      requester: b.requesterName || b.name || "-",
      member1: b.member1 || "-",
      member2: b.member2 || "-",
      purpose: b.purpose || "-",
      date: b.date || "-",
      timeSlot: b.timeSlot || "-",
      status: b.status || "-",
    });
  });

  setupResponsibleSelector();
  renderRoomSlots();
};

const setupEquipmentRulesPopup = () => {
  if (!isCurrentPage("equipment.html")) return;
  const modal = byId("equipmentRulesModal");
  const acceptBtn = byId("equipmentRulesAcceptBtn");
  if (!modal || !acceptBtn) return;

  const user = getCurrentUser();
  const session = getSession();
  const getSeenKey = () => {
    if (user) {
      const stamp = session?.loginAt || "legacy";
      return `eq_rules_seen_${user.username || user.email || "user"}_${stamp}`;
    }
    return "eq_rules_seen_guest";
  };

  if (!acceptBtn.dataset.bound) {
    acceptBtn.dataset.bound = "1";
    acceptBtn.addEventListener("click", () => {
      sessionStorage.setItem(getSeenKey(), "1");
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
    });
  }

  const seen = sessionStorage.getItem(getSeenKey()) === "1";
  modal.hidden = seen;
  document.body.classList.toggle("no-scroll", !seen);
};

const setupRoomRulesPopup = () => {
  if (!isCurrentPage("rooms.html")) return;
  const modal = byId("roomRulesModal");
  const acceptBtn = byId("roomRulesAcceptBtn");
  if (!modal || !acceptBtn) return;

  const user = getCurrentUser();
  const session = getSession();
  const getSeenKey = () => {
    if (user) {
      const stamp = session?.loginAt || "legacy";
      return `room_rules_seen_${user.username || user.email || "user"}_${stamp}`;
    }
    return "room_rules_seen_guest";
  };

  if (!acceptBtn.dataset.bound) {
    acceptBtn.dataset.bound = "1";
    acceptBtn.addEventListener("click", () => {
      sessionStorage.setItem(getSeenKey(), "1");
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
    });
  }

  const seen = sessionStorage.getItem(getSeenKey()) === "1";
  modal.hidden = seen;
  document.body.classList.toggle("no-scroll", !seen);
};

const updateBookingAuthUI = () => {
  const loggedIn = Boolean(getCurrentUser());
  const roomForm = byId("roomBookingForm");
  const roomCard = byId("roomBookingCard");
  const roomMainGrid = byId("roomMainGrid");
  const roomLegendMine = byId("roomLegendMine");
  const eqForm = byId("equipmentBookingForm");
  const eqCard = byId("equipmentBookingCard");
  const eqMainGrid = byId("equipmentMainGrid");
  const eqReturnAllBtn = byId("eqReturnAllBtn");
  const eqFilter = byId("eqListFilter");
  const roomHint = byId("roomAuthHint");
  const eqHint = byId("equipmentAuthHint");

  if (roomForm) {
    if (roomCard) roomCard.hidden = !loggedIn;
    if (roomMainGrid) roomMainGrid.classList.toggle("single-col", !loggedIn);
    if (roomLegendMine) roomLegendMine.hidden = !loggedIn;
    const submit = roomForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = !loggedIn;
    if (roomHint) roomHint.textContent = loggedIn ? "" : t("loginRequiredToBook");
    setupRoomRulesPopup();
  }
  if (eqForm) {
    if (eqCard) eqCard.hidden = !loggedIn;
    if (eqMainGrid) eqMainGrid.classList.toggle("single-col", !loggedIn);
    const submit = eqForm.querySelector('button[type="submit"]');
    if (submit) submit.disabled = !loggedIn;
    if (eqHint) eqHint.textContent = loggedIn ? "" : t("loginRequiredToBook");
    const disabled = !loggedIn;
    const ids = ["eqName", "eqDate", "eqTime", "eqDetail"];
    ids.forEach((id) => {
      const el = byId(id);
      if (el) el.disabled = disabled;
    });
    if (disabled) {
      const responsibleWrap = byId("eqResponsibleOptions");
      if (responsibleWrap) responsibleWrap.innerHTML = `<p class="muted">${t("loginRequiredToBook")}</p>`;
      if (eqFilter) eqFilter.value = "all";
      if (eqReturnAllBtn) eqReturnAllBtn.hidden = true;
    } else {
      const me = getCurrentUser();
      const eqName = byId("eqName");
      if (eqName && !eqName.value) eqName.value = me?.username || me?.name || me?.email || "";
      renderEqResponsibleOptions();
      syncEquipmentEligibility();
    }
    renderEquipmentCatalog();
    setupEquipmentRulesPopup();
  }
};

const setupHomeBottomEditor = () => {
  const tools = byId("labBottomAdminTools");
  const form = byId("labBottomForm");
  const toggleBtn = byId("toggleLabEditBtn");
  if (!tools || !form || !toggleBtn) return;

  if (!isAdminSession()) {
    tools.hidden = true;
    return;
  }

  tools.hidden = false;
  const info = { ...defaultHomeInfo, ...load(storageKeys.homeInfo, defaultHomeInfo) };
  byId("labFormOrgName").value = info.orgName || "";
  byId("labFormAddress").value = info.address || "";
  byId("labFormFacebook").value = info.contactFacebook || "";
  byId("labFormInstagram").value = info.contactInstagram || "";
  byId("labFormPhone").value = info.contactPhone || "";
  byId("labFormUnits").value = Array.isArray(info.units) ? info.units.join("\n") : "";
  byId("labFormMapUrl").value = info.mapUrl || "";
  byId("labFormManagerName").value = info.managerName || "";
  byId("labFormManagerRole").value = info.managerRole || "";
  const showManagerInput = byId("labFormShowManager");
  if (showManagerInput) showManagerInput.checked = info.managerVisible !== false;

  toggleBtn.addEventListener("click", () => {
    if (!requireAdminAction()) return;
    form.hidden = !form.hidden;
    toggleBtn.textContent = form.hidden ? t("toggleShowEdit") : t("toggleHideEdit");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    let uploadedImage = "";
    const imageFile = byId("labFormManagerImageFile")?.files?.[0];
    if (imageFile) {
      try {
        uploadedImage = await fileToDataUrl(imageFile);
      } catch {
        uploadedImage = "";
      }
    }
    const next = {
      orgName: byId("labFormOrgName").value.trim(),
      address: byId("labFormAddress").value.trim(),
      contactFacebook: byId("labFormFacebook").value.trim(),
      contactInstagram: byId("labFormInstagram").value.trim(),
      contactPhone: byId("labFormPhone").value.trim(),
      units: byId("labFormUnits")
        .value.split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
      mapUrl: byId("labFormMapUrl").value.trim(),
      managerName: byId("labFormManagerName").value.trim(),
      managerRole: byId("labFormManagerRole").value.trim(),
      managerVisible: byId("labFormShowManager")?.checked !== false,
      managerImage:
        uploadedImage ||
        info.managerImage ||
        "image/IconLab.png",
    };
    save(storageKeys.homeInfo, { ...defaultHomeInfo, ...next });
    renderHomeBottomInfo();
    setNotice(byId("labBottomNotice"), t("labSaveOk"));
    const fileField = byId("labFormManagerImageFile");
    if (fileField) fileField.value = "";
    form.hidden = true;
    toggleBtn.textContent = t("toggleShowEdit");
  });
};

const getResponsibleStaff = () => load(storageKeys.responsibleStaff, defaultResponsibleStaff);

const renderResponsibleOptions = () => {
  const box = byId("responsibleOptions");
  if (!box) return;
  const selected = byId("selectedResponsibleId")?.value || "";
  const list = getResponsibleStaff();
  box.innerHTML = list.length
    ? list
        .map(
          (s) => `<div class="responsible-card ${selected === s.id ? "active" : ""}" data-responsible-id="${s.id}">
            <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
            <div>
              <p class="responsible-name">${s.name}</p>
              <p class="responsible-email">${s.email}</p>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleOptions")}</p>`;
};

const setupResponsibleSelector = () => {
  const box = byId("responsibleOptions");
  const hidden = byId("selectedResponsibleId");
  if (!box || !hidden) return;

  if (!hidden.value) {
    const first = getResponsibleStaff()[0];
    hidden.value = first?.id || "";
  }
renderResponsibleOptions();
renderEqResponsibleOptions();

  box.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-responsible-id]");
    if (!(card instanceof HTMLElement)) return;
    hidden.value = card.dataset.responsibleId || "";
    renderResponsibleOptions();
    renderEqResponsibleOptions();
  });
};

const getEquipmentItems = () => load(storageKeys.equipmentItems, defaultEquipmentItems);
const getEquipmentTypes = () => load(storageKeys.equipmentTypes, defaultEquipmentTypes);
const normalizeEquipmentTypes = () => {
  const list = [...new Set(getEquipmentTypes().map((v) => String(v || "").trim()).filter(Boolean))];
  return list.length ? list : [...defaultEquipmentTypes];
};
const normalizeEquipmentItems = () =>
  getEquipmentItems().map((it, idx) => ({
    id: it.id || `eq-${idx + 1}`,
    name: it.name || `Item ${idx + 1}`,
    image: it.image || "image/IconLab.png",
    stock: Math.max(1, Number(it.stock || 1)),
    type: it.type || "ทั่วไป",
  }));

const renderEquipmentTypeFilterOptions = () => {
  const select = byId("eqTypeFilter");
  if (!select) return;
  const current = select.value || "all";
  const types = normalizeEquipmentTypes();
  select.innerHTML =
    `<option value="all">${t("equipmentTypeAllFilter")}</option>` +
    types.map((type) => `<option value="${type}">${type}</option>`).join("");
  if (current !== "all" && types.includes(current)) {
    select.value = current;
  } else {
    select.value = "all";
  }
};

const refreshEquipmentFilterLabels = () => {
  const availableOpt = byId("eqListFilter")?.querySelector('option[value="available"]');
  if (availableOpt) availableOpt.textContent = t("equipmentFilterAvailable");
};

const getBorrowedQtyByItemId = (itemId) => {
  const item = normalizeEquipmentItems().find((x) => x.id === itemId);
  return load(storageKeys.equipmentBookings, [])
    .filter((b) => b.itemId === itemId || (!b.itemId && item && b.item === item.name))
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .reduce((sum, b) => sum + Math.max(1, Number(b.quantity || 1)), 0);
};

const getAvailableQtyByItemId = (itemId) => {
  const item = normalizeEquipmentItems().find((x) => x.id === itemId);
  if (!item) return 0;
  return Math.max(item.stock - getBorrowedQtyByItemId(itemId), 0);
};

const getMyActiveEquipmentBookings = (user) =>
  load(storageKeys.equipmentBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const renderSelectedEquipmentList = () => {
  const wrap = byId("eqSelectedItemsList");
  const hidden = byId("eqItemsJson");
  const clearBtn = byId("eqClearSelectionBtn");
  if (!wrap || !hidden) return;
  hidden.value = JSON.stringify(selectedEquipmentEntries);
  if (clearBtn) clearBtn.disabled = selectedEquipmentEntries.length === 0;
  if (!selectedEquipmentEntries.length) {
    wrap.innerHTML = `<p class="muted">${t("equipmentSelectedListEmpty")}</p>`;
    return;
  }
  wrap.innerHTML = selectedEquipmentEntries
    .map(
      (entry, index) => `<div class="admin-item">
      <div>
        <p><strong>${entry.name}</strong></p>
        <p class="muted">${t("quantityLabel")}: <input type="number" min="1" value="${entry.quantity}" data-eq-selected-qty="${index}" style="width:84px;" /></p>
      </div>
      <div class="feed-actions-end inline-actions">
        <button type="button" class="btn-small danger" data-eq-remove-selected="${index}">${t("deleteBtn")}</button>
      </div>
    </div>`
    )
    .join("");
};

let selectedEquipmentItemId = "";
let equipmentReturnSubmitting = false;
let selectedEquipmentEntries = [];

const renderEquipmentCatalog = () => {
  const grid = byId("eqCatalogGrid");
  const filter = byId("eqListFilter");
  const typeFilter = byId("eqTypeFilter");
  const hint = byId("eqListHint");
  const returnAllBtn = byId("eqReturnAllBtn");
  if (!grid || !filter) return;

  const me = getCurrentUser();
  let mode = filter.value || "all";
  const selectedType = typeFilter?.value || "all";
  const items = normalizeEquipmentItems();
  const canBook = Boolean(byId("eqTime")?.value);

  if (mode === "all" || mode === "available") {
    equipmentReturnSubmitting = false;
    if (returnAllBtn) returnAllBtn.hidden = true;
    grid.innerHTML = items
      .filter((item) => selectedType === "all" || (item.type || "ทั่วไป") === selectedType)
      .filter((item) => (mode === "available" ? getAvailableQtyByItemId(item.id) > 0 : true))
      .map((item) => {
        const available = getAvailableQtyByItemId(item.id);
        const borrowed = getBorrowedQtyByItemId(item.id);
        const exhausted = available <= 0;
        const active =
          selectedEquipmentItemId === item.id ||
          selectedEquipmentEntries.some((entry) => entry.itemId === item.id);
        return `<div class="equipment-card ${exhausted ? "exhausted" : ""} ${active ? "active" : ""}" data-eq-item-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" />
          <p><strong>${item.name}</strong></p>
          <p class="muted">${t("equipmentTypeLabel")}: ${item.type || "ทั่วไป"}</p>
          <p class="muted">${t("equipmentBookedLabel")}: ${borrowed}</p>
          <p class="muted">${exhausted ? t("equipmentEmptyLabel") : t("equipmentLeftLabel", { available, stock: item.stock })}</p>
        </div>`;
      })
      .join("");
    if (hint) {
      hint.textContent = canBook ? t("equipmentPickHint") : t("equipmentNeedTime");
    }
    if (returnAllBtn) returnAllBtn.disabled = true;
    return;
  }

  selectedEquipmentItemId = "";
  if (!me) {
    if (returnAllBtn) returnAllBtn.hidden = true;
    const active = load(storageKeys.equipmentBookings, [])
      .filter((b) => (b.returnStatus || "borrowed") !== "returned")
      .filter((b) => {
        const item = items.find((x) => x.id === b.itemId || (!b.itemId && x.name === b.item));
        const itemType = item?.type || "ทั่วไป";
        return selectedType === "all" || itemType === selectedType;
      });
    const grouped = new Map();
    active.forEach((b) => {
      const key = b.itemId || b.item || "-";
      const current = grouped.get(key) || {
        item: b.item || "-",
        itemId: b.itemId || "",
        quantity: 0,
        latestDate: b.date || "",
      };
      current.quantity += Math.max(1, Number(b.quantity || 1));
      current.latestDate = b.date || current.latestDate;
      grouped.set(key, current);
    });
    const rows = [...grouped.values()];
    grid.innerHTML = rows.length
      ? rows
          .map((r) => {
            const item = items.find((x) => x.id === r.itemId || x.name === r.item);
            return `<div class="equipment-card">
              <img src="${item?.image || "image/IconLab.png"}" alt="${r.item}" />
              <p><strong>${r.item}</strong></p>
              <p class="muted">${t("equipmentBookedLabel")}: ${r.quantity}</p>
              <p class="muted">${t("profileUsageDate")}: ${r.latestDate || "-"}</p>
            </div>`;
          })
          .join("")
      : `<p class="muted">${t("equipmentBookedEmpty")}</p>`;
    if (hint) hint.textContent = "";
    return;
  }

  if (returnAllBtn) returnAllBtn.hidden = false;
  const bookings = getMyActiveEquipmentBookings(me).filter((b) => {
    const item = items.find((x) => x.id === b.itemId || (!b.itemId && x.name === b.item));
    const itemType = item?.type || "ทั่วไป";
    return selectedType === "all" || itemType === selectedType;
  });
  grid.innerHTML = bookings.length
    ? bookings
        .map((b) => {
          const item = items.find((x) => x.id === b.itemId);
          return `<div class="equipment-card">
            <img src="${item?.image || "image/IconLab.png"}" alt="${b.item}" />
            <p><strong>${b.item}</strong> x ${b.quantity}</p>
            <p class="muted">${b.date} | ${b.timeSlot || "-"}</p>
            <p class="muted">สถานะ: ${equipmentReturnStatusLabel(b.returnStatus || "borrowed")}</p>
            ${
              b.returnProofImage
                ? `<p class="muted">${t("equipmentReturnProofLabel")}</p><img class="return-proof-thumb" src="${b.returnProofImage}" alt="return-proof" />`
                : ""
            }
          </div>`;
        })
        .join("")
    : `<p class="muted">${t("equipmentBookedEmpty")}</p>`;
  if (hint) hint.textContent = t("equipmentReturnHint");
  if (returnAllBtn) returnAllBtn.disabled = bookings.length === 0 || equipmentReturnSubmitting;
};

const renderEqResponsibleOptions = () => {
  const box = byId("eqResponsibleOptions");
  if (!box) return;
  const selected = byId("eqSelectedResponsibleId")?.value || "";
  const list = getResponsibleStaff();
  box.innerHTML = list.length
    ? list
        .map(
          (s) => `<div class="responsible-card ${selected === s.id ? "active" : ""}" data-eq-responsible-id="${s.id}">
            <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
            <div>
              <p class="responsible-name">${s.name}</p>
              <p class="responsible-email">${s.email}</p>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleOptions")}</p>`;
};

const setupEqResponsibleSelector = () => {
  const box = byId("eqResponsibleOptions");
  const hidden = byId("eqSelectedResponsibleId");
  if (!box || !hidden) return;

  if (!hidden.value) {
    hidden.value = getResponsibleStaff()[0]?.id || "";
  }
  renderEqResponsibleOptions();

  box.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-eq-responsible-id]");
    if (!(card instanceof HTMLElement)) return;
    hidden.value = card.dataset.eqResponsibleId || "";
    renderEqResponsibleOptions();
  });
};

const getMyApprovedRoomSlots = (user) => {
  if (!user) return [];
  return load(storageKeys.roomBookings, [])
    .filter((b) => b.status === "approved")
    .filter((b) => isBookingOwnedByUser(b, user))
    .map((b) => ({ date: b.date, timeSlot: b.timeSlot, room: b.room || "Lab-F11" }));
};

const syncEquipmentEligibility = () => {
  const eqDate = byId("eqDate");
  const eqTime = byId("eqTime");
  const eqDetail = byId("eqDetail");
  const selectedLabel = byId("eqSelectedItemLabel");
  const hint = byId("eqRoomRuleHint");
  const addBtn = byId("eqAddToSelectionBtn");
  const eqName = byId("eqName");
  if (!eqDate || !eqTime) return;

  const user = getCurrentUser();
  if (!user) {
    eqDate.disabled = true;
    eqTime.disabled = true;
    if (eqDetail) eqDetail.disabled = true;
    if (addBtn) addBtn.disabled = true;
    if (eqName) eqName.value = "";
    eqDate.innerHTML = `<option value="">${t("equipmentSelectDateFromRoom")}</option>`;
    eqTime.innerHTML = `<option value="">${t("selectTime")}</option>`;
    if (selectedLabel) selectedLabel.value = t("equipmentSelectDefault");
    selectedEquipmentItemId = "";
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    if (hint) hint.textContent = t("loginRequiredToBook");
    equipmentReturnSubmitting = false;
    renderEquipmentCatalog();
    return;
  }

  if (eqName) eqName.value = user.username || user.name || user.email || "";

  const slots = getMyApprovedRoomSlots(user);
  const dates = [...new Set(slots.map((s) => s.date).filter(Boolean))].sort();
  const prevDate = eqDate.value || "";
  eqDate.innerHTML =
    `<option value="">${t("equipmentSelectDateFromRoom")}</option>` +
    dates.map((d) => `<option value="${d}">${d}</option>`).join("");
  eqDate.value = dates.includes(prevDate) ? prevDate : dates[0] || "";
  eqDate.disabled = !dates.length;
  const date = eqDate.value || "";
  const times = [...new Set(slots.filter((s) => s.date === date).map((s) => s.timeSlot))];
  const prevTime = eqTime.value;
  eqTime.innerHTML =
    `<option value="">${t("selectTime")}</option>` +
    times.map((ts) => `<option value="${ts}">${ts}</option>`).join("");
  eqTime.value = times.includes(prevTime) ? prevTime : "";
  eqTime.disabled = !date || !times.length;

  const canPickEquipment = Boolean(eqTime.value);
  if (eqDetail) eqDetail.disabled = !canPickEquipment;
  if (addBtn) addBtn.disabled = !canPickEquipment;
  if (!canPickEquipment) {
    selectedEquipmentItemId = "";
    if (selectedLabel) selectedLabel.value = t("equipmentSelectDefault");
  }

  if (!date) {
    if (hint) hint.textContent = dates.length ? t("equipmentNeedDate") : t("equipmentNoMatchTime");
  } else if (!times.length) {
    if (hint) hint.textContent = t("equipmentNoMatchTime");
  } else if (!eqTime.value) {
    if (hint) hint.textContent = t("equipmentNeedTime");
  } else {
    if (hint) hint.textContent = "";
  }
  renderEquipmentCatalog();
};

const setupEquipmentBookingUI = () => {
  const form = byId("equipmentBookingForm");
  if (!form) return;
  const me = getCurrentUser();
  if (me && byId("eqName") && !byId("eqName").value) {
    byId("eqName").value = me.username || me.name || me.email || "";
  }
  selectedEquipmentEntries = [];
  renderSelectedEquipmentList();
  if (byId("eqSelectedItemLabel")) byId("eqSelectedItemLabel").value = t("equipmentSelectDefault");
  refreshEquipmentFilterLabels();
  renderEquipmentTypeFilterOptions();
  byId("eqListFilter")?.addEventListener("change", () => {
    renderEquipmentCatalog();
  });
  byId("eqTypeFilter")?.addEventListener("change", () => {
    renderEquipmentCatalog();
  });

  byId("eqCatalogGrid")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const itemCard = target.closest("[data-eq-item-id]");

    if (itemCard instanceof HTMLElement) {
      const mode = byId("eqListFilter")?.value || "all";
      if (!(mode === "all" || mode === "available")) return;
      const itemId = itemCard.dataset.eqItemId || "";
      const available = getAvailableQtyByItemId(itemId);
      const canPickEquipment = Boolean(byId("eqTime")?.value);
      if (!canPickEquipment || available <= 0) return;
      const item = normalizeEquipmentItems().find((x) => x.id === itemId);
      selectedEquipmentItemId = itemId;
      byId("eqSelectedItemLabel").value = item ? `${item.name} (${t("equipmentLeftLabel", { available, stock: item.stock })})` : t("equipmentSelectDefault");
      renderEquipmentCatalog();
      return;
    }
  });

  byId("eqAddToSelectionBtn")?.addEventListener("click", () => {
    const notice = byId("equipmentNotice");
    if (!byId("eqDate")?.value) {
      setNotice(notice, t("equipmentNeedDate"), "error");
      return;
    }
    if (!byId("eqTime")?.value) {
      setNotice(notice, t("equipmentNeedTime"), "error");
      return;
    }
    if (!selectedEquipmentItemId) {
      setNotice(notice, t("equipmentSelectionNeedItem"), "error");
      return;
    }
    if (selectedEquipmentEntries.some((entry) => entry.itemId === selectedEquipmentItemId)) {
      setNotice(notice, t("equipmentSelectionDuplicate"), "error");
      return;
    }
    if (selectedEquipmentEntries.length >= 5) {
      setNotice(notice, t("equipmentSelectionMaxReached"), "error");
      return;
    }
    const item = normalizeEquipmentItems().find((x) => x.id === selectedEquipmentItemId);
    if (!item) return;
    const available = getAvailableQtyByItemId(item.id);
    if (available <= 0) {
      setNotice(notice, t("equipmentOutOfStock"), "error");
      return;
    }
    selectedEquipmentEntries.push({
      itemId: item.id,
      name: item.name,
      quantity: 1,
    });
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
    setNotice(notice, t("equipmentSelectionAdded"));
  });

  byId("eqSelectedItemsList")?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const removeIndex = target.dataset.eqRemoveSelected;
    if (removeIndex === undefined) return;
    const index = Number(removeIndex);
    if (Number.isNaN(index) || index < 0 || index >= selectedEquipmentEntries.length) return;
    selectedEquipmentEntries.splice(index, 1);
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
  });

  byId("eqSelectedItemsList")?.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    const idx = target.dataset.eqSelectedQty;
    if (idx === undefined) return;
    const index = Number(idx);
    if (Number.isNaN(index) || index < 0 || index >= selectedEquipmentEntries.length) return;
    const entry = selectedEquipmentEntries[index];
    const max = getAvailableQtyByItemId(entry.itemId) + entry.quantity;
    const qty = Math.max(1, Math.min(max, Number(target.value || 1)));
    entry.quantity = qty;
    target.value = String(qty);
    renderSelectedEquipmentList();
  });

  byId("eqClearSelectionBtn")?.addEventListener("click", () => {
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    renderEquipmentCatalog();
  });

  byId("eqReturnAllBtn")?.addEventListener("click", async () => {
    if (equipmentReturnSubmitting) return;
    const meUser = getCurrentUser();
    if (!meUser) return;
    const all = getMyActiveEquipmentBookings(meUser).map((b) => b.bookingId);
    if (!all.length) return;
    equipmentReturnSubmitting = true;
    renderEquipmentCatalog();
    await requestMultipleEquipmentReturns(all, { askProofInModal: true });
    equipmentReturnSubmitting = false;
    renderEquipmentCatalog();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const notice = byId("equipmentNotice");
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setNotice(notice, t("loginRequiredToBook"), "error");
      return;
    }
    const date = byId("eqDate")?.value || "";
    const timeSlot = byId("eqTime")?.value || "";
    const responsibleId = byId("eqSelectedResponsibleId")?.value || "";
    const detail = byId("eqDetail")?.value || "";
    if (!date || !timeSlot || !responsibleId || !selectedEquipmentEntries.length) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (selectedEquipmentEntries.length > 5) {
      setNotice(notice, t("equipmentSelectionMaxReached"), "error");
      return;
    }
    const matched = load(storageKeys.roomBookings, [])
      .filter((b) => b.status === "approved")
      .filter((b) => isBookingOwnedByUser(b, currentUser))
      .some((b) => b.date === date && b.timeSlot === timeSlot);
    if (!matched) {
      setNotice(notice, t("equipmentNeedRoom"), "error");
      return;
    }
    for (const entry of selectedEquipmentEntries) {
      const available = getAvailableQtyByItemId(entry.itemId);
      const qty = Math.max(1, Number(entry.quantity || 1));
      if (available <= 0 || qty > available) {
        setNotice(notice, t("equipmentOutOfStock"), "error");
        return;
      }
    }
    const list = load(storageKeys.equipmentBookings);
    const bookerName = currentUser.username || currentUser.name || currentUser.email || "";
    const nowIso = new Date().toISOString();
    selectedEquipmentEntries.forEach((entry) => {
      list.push({
        bookingId: `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: bookerName,
        username: currentUser.username || "",
        email: currentUser.email || "",
        item: entry.name,
        itemId: entry.itemId,
        quantity: Math.max(1, Number(entry.quantity || 1)),
        date,
        timeSlot,
        room: "Lab-F11",
        responsibleId,
        detail,
        createdAt: nowIso,
        returnStatus: "borrowed",
      });
    });
    save(storageKeys.equipmentBookings, list);
    setNotice(notice, t("bookingSaved"));
    form.reset();
    const hidden = byId("eqSelectedResponsibleId");
    if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
    selectedEquipmentItemId = "";
    selectedEquipmentEntries = [];
    renderSelectedEquipmentList();
    syncEquipmentEligibility();
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderProfilePage();
    renderAdminUserProfilePanel();
  });

  setupEqResponsibleSelector();
  byId("eqDate")?.addEventListener("change", syncEquipmentEligibility);
  byId("eqTime")?.addEventListener("change", syncEquipmentEligibility);
  syncEquipmentEligibility();
};

const equipmentReturnStatusLabel = (status) => {
  if (status === "returned") return t("equipmentReturnStatusReturned");
  if (status === "return_requested") return t("equipmentReturnStatusRequested");
  return t("equipmentReturnStatusBorrowed");
};

const renderResponsibleAdminList = () => {
  const wrap = byId("responsibleList");
  if (!wrap) return;
  const list = getResponsibleStaff();
  wrap.classList.add("responsible-admin-list");
  wrap.innerHTML = list.length
    ? list
        .map(
          (s, i) => `<div class="admin-item">
            <div style="display:flex;gap:0.6rem;align-items:center;">
              <img src="${s.image || "image/IconLab.png"}" alt="${s.name}" />
              <div>
                <p><strong>${s.name}</strong></p>
                <p class="muted">${s.email}</p>
              </div>
            </div>
            <div><button type="button" class="btn-small danger" data-delete-responsible="${i}">${t("deleteBtn")}</button></div>
          </div>`
        )
        .join("")
    : `<p class="muted">${t("noResponsibleItems")}</p>`;
};

const setupResponsibleAdmin = () => {
  const form = byId("responsibleForm");
  if (!form) return;

  renderResponsibleAdminList();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const name = byId("responsibleName").value.trim();
    const email = byId("responsibleEmail").value.trim().toLowerCase();
    const imageUrl = byId("responsibleImageUrl").value.trim();
    const file = byId("responsibleImageFile")?.files?.[0];
    const notice = byId("responsibleNotice");
    if (!name || !email) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    if (!imageUrl && !file) {
      setNotice(notice, t("responsibleImageRequired"), "error");
      return;
    }
    let image = imageUrl || "image/IconLab.png";
    if (file) {
      try {
        image = await fileToDataUrl(file);
      } catch {
        image = imageUrl || "image/IconLab.png";
      }
    }

    const list = getResponsibleStaff();
    list.push({
      id: `staff-${Date.now()}`,
      name,
      email,
      image,
    });
    save(storageKeys.responsibleStaff, list);
    setNotice(notice, t("responsibleSaved"));
    form.reset();
    renderResponsibleAdminList();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderBroadcastRecipientList();
  });
};

const equipmentCropState = {
  image: null,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  croppedDataUrl: "",
};
let editingEquipmentId = "";

const drawEquipmentCropCanvas = () => {
  const canvas = byId("eqCropCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5fbfd";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!equipmentCropState.image) {
    ctx.fillStyle = "#8fa1b2";
    ctx.font = "14px sans-serif";
    ctx.fillText("No Image", 12, 24);
    return;
  }
  const frame = getCropFrame(canvas);
  const img = equipmentCropState.image;
  const scale = Math.max(frame.w / img.width, frame.h / img.height) * equipmentCropState.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = frame.x + (frame.w - drawW) / 2 + equipmentCropState.offsetX;
  const dy = frame.y + (frame.h - drawH) / 2 + equipmentCropState.offsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.fillStyle = "rgba(34,45,58,0.28)";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.fill("evenodd");
  ctx.strokeStyle = "#7aafbf";
  ctx.lineWidth = 2;
  ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
};

const createEquipmentCroppedDataUrl = () => {
  const canvas = byId("eqCropCanvas");
  if (!canvas || !equipmentCropState.image) return "";
  const frame = getCropFrame(canvas);
  const img = equipmentCropState.image;
  const scale = Math.max(frame.w / img.width, frame.h / img.height) * equipmentCropState.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const dx = frame.x + (frame.w - drawW) / 2 + equipmentCropState.offsetX;
  const dy = frame.y + (frame.h - drawH) / 2 + equipmentCropState.offsetY;
  const sx = (frame.x - dx) / scale;
  const sy = (frame.y - dy) / scale;
  const sw = frame.w / scale;
  const sh = frame.h / scale;
  if (sw <= 0 || sh <= 0) return "";
  const out = document.createElement("canvas");
  out.width = Math.round(frame.w);
  out.height = Math.round(frame.h);
  const outCtx = out.getContext("2d");
  if (!outCtx) return "";
  outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
  return out.toDataURL("image/jpeg", 0.9);
};

const setupEquipmentCropTool = () => {
  const input = byId("eqAdminImage");
  const zoom = byId("eqCropZoom");
  const x = byId("eqCropX");
  const y = byId("eqCropY");
  const applyBtn = byId("eqApplyCropBtn");
  const status = byId("eqCropStatus");
  if (!input || !zoom || !x || !y || !applyBtn || !status) return;

  const setStatus = (msg) => {
    status.textContent = msg;
  };

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    equipmentCropState.croppedDataUrl = "";
    if (!file) {
      equipmentCropState.image = null;
      drawEquipmentCropCanvas();
      setStatus(t("cropEmpty"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        equipmentCropState.image = img;
        equipmentCropState.zoom = 1;
        equipmentCropState.offsetX = 0;
        equipmentCropState.offsetY = 0;
        zoom.value = "1";
        x.value = "0";
        y.value = "0";
        drawEquipmentCropCanvas();
        setStatus(t("cropPending"));
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  [zoom, x, y].forEach((el) =>
    el.addEventListener("input", () => {
      equipmentCropState.zoom = Number(zoom.value || 1);
      equipmentCropState.offsetX = Number(x.value || 0);
      equipmentCropState.offsetY = Number(y.value || 0);
      drawEquipmentCropCanvas();
    })
  );

  applyBtn.addEventListener("click", () => {
    equipmentCropState.croppedDataUrl = createEquipmentCroppedDataUrl();
    setStatus(equipmentCropState.croppedDataUrl ? t("cropReady") : t("equipmentAdminImageRequired"));
  });

  drawEquipmentCropCanvas();
  setStatus(t("cropEmpty"));
};

const renderEquipmentAdminList = () => {
  const wrap = byId("equipmentAdminList");
  if (!wrap) return;
  const list = normalizeEquipmentItems();
  wrap.innerHTML = list.length
    ? list
        .map(
          (item, i) => `<div class="admin-item">
            <div style="display:flex;gap:0.6rem;align-items:center;${getAvailableQtyByItemId(item.id) <= 0 ? "opacity:0.5;" : ""}">
              <img src="${item.image || "image/IconLab.png"}" alt="${item.name}" style="width:62px;height:62px;border-radius:10px;object-fit:cover;border:1px solid #cadce3;" />
              <div>
                <p><strong>${item.name}</strong></p>
                <p class="muted">${t("equipmentTypeLabel")}: ${item.type || "ทั่วไป"}</p>
                <p class="muted">คงเหลือ ${getAvailableQtyByItemId(item.id)}/${item.stock} ${getAvailableQtyByItemId(item.id) <= 0 ? "(หมด)" : ""}</p>
              </div>
            </div>
            <div>
              <button type="button" class="btn-small" data-edit-equipment="${i}">แก้ไข</button>
              <button type="button" class="btn-small danger" data-delete-equipment="${i}">${t("deleteBtn")}</button>
            </div>
          </div>`
        )
        .join("")
    : `<p class="muted">ยังไม่มีรายการอุปกรณ์</p>`;
};

const setupEquipmentAdminTools = () => {
  const tools = byId("equipmentAdminTools");
  const form = byId("equipmentAdminForm");
  const body = byId("equipmentAdminBody");
  const toggleBtn = byId("toggleEquipmentAdminBtn");
  if (!tools || !form || !body || !toggleBtn) return;
  const typeSelect = byId("eqAdminType");
  const addTypeBtn = byId("eqAddTypeBtn");
  const newTypeInput = byId("eqAdminNewType");

  const renderEquipmentTypeOptions = (selectedType = "") => {
    if (!typeSelect) return;
    const types = normalizeEquipmentTypes();
    typeSelect.innerHTML = types
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
    if (selectedType && types.includes(selectedType)) {
      typeSelect.value = selectedType;
    } else if (!typeSelect.value && types.length) {
      typeSelect.value = types[0];
    }
  };

  if (!isAdminSession()) {
    tools.hidden = true;
    return;
  }
  tools.hidden = false;
  body.hidden = true;
  toggleBtn.textContent = t("toggleShowEdit");
  renderEquipmentTypeOptions();
  renderEquipmentAdminList();

  if (!toggleBtn.dataset.bound) {
    toggleBtn.dataset.bound = "1";
    toggleBtn.addEventListener("click", () => {
      body.hidden = !body.hidden;
      toggleBtn.textContent = body.hidden ? t("toggleShowEdit") : t("toggleHideEdit");
    });
  }

  addTypeBtn?.addEventListener("click", () => {
    if (!requireAdminAction()) return;
    const value = String(newTypeInput?.value || "").trim();
    if (!value) return;
    const types = normalizeEquipmentTypes();
    if (!types.includes(value)) {
      types.push(value);
      save(storageKeys.equipmentTypes, types);
    }
    renderEquipmentTypeOptions(value);
    renderEquipmentTypeFilterOptions();
    renderEquipmentCatalog();
    if (newTypeInput) newTypeInput.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const notice = byId("equipmentAdminNotice");
    const name = byId("eqAdminName")?.value?.trim() || "";
    const stock = Math.max(1, Number(byId("eqAdminStock")?.value || 1));
    const type = byId("eqAdminType")?.value?.trim() || "ทั่วไป";
    if (!name) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }
    const list = normalizeEquipmentItems();
    const existing = editingEquipmentId ? list.find((i) => i.id === editingEquipmentId) : null;
    const image = equipmentCropState.croppedDataUrl || existing?.image || "";
    if (!image) {
      setNotice(notice, t("equipmentAdminImageRequired"), "error");
      return;
    }
    if (editingEquipmentId) {
      const index = list.findIndex((i) => i.id === editingEquipmentId);
      if (index >= 0) list[index] = { ...list[index], name, image, stock, type };
    } else {
      list.push({
        id: `eq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        image,
        stock,
        type,
      });
    }
    save(storageKeys.equipmentItems, list);
    setNotice(notice, t("equipmentAdminSaved"));
    form.reset();
    renderEquipmentTypeOptions();
    editingEquipmentId = "";
    equipmentCropState.image = null;
    equipmentCropState.croppedDataUrl = "";
    drawEquipmentCropCanvas();
    const cropStatus = byId("eqCropStatus");
    if (cropStatus) cropStatus.textContent = t("cropEmpty");
    renderEquipmentAdminList();
    renderEquipmentTypeFilterOptions();
    syncEquipmentEligibility();
  });

  byId("equipmentAdminList")?.addEventListener("click", (e) => {
    if (!requireAdminAction()) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.editEquipment !== undefined) {
      const index = Number(target.dataset.editEquipment);
      const list = normalizeEquipmentItems();
      const item = list[index];
      if (!item) return;
      editingEquipmentId = item.id;
      byId("eqAdminName").value = item.name || "";
      byId("eqAdminStock").value = String(item.stock || 1);
      renderEquipmentTypeOptions(item.type || "ทั่วไป");
      equipmentCropState.croppedDataUrl = item.image || "";
      const img = new Image();
      img.onload = () => {
        equipmentCropState.image = img;
        equipmentCropState.zoom = 1;
        equipmentCropState.offsetX = 0;
        equipmentCropState.offsetY = 0;
        byId("eqCropZoom").value = "1";
        byId("eqCropX").value = "0";
        byId("eqCropY").value = "0";
        drawEquipmentCropCanvas();
      };
      img.src = item.image || "";
      return;
    }

    if (target.dataset.deleteEquipment !== undefined) {
      if (!window.confirm(t("confirmDeleteEquipment"))) return;
      const index = Number(target.dataset.deleteEquipment);
      const list = normalizeEquipmentItems();
      if (!list[index]) return;
      list.splice(index, 1);
      save(storageKeys.equipmentItems, list);
      renderEquipmentAdminList();
      syncEquipmentEligibility();
    }
  });
};

const sendResponsibleEmailDraft = async (responsible, booking) => {
  if (!responsible?.email) return false;
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: booking.requesterName,
    member1: booking.member1 || "",
    member2: booking.member2 || "",
    purpose: booking.purpose || "",
    date: booking.date,
    timeSlot: booking.timeSlot,
    room: booking.room,
    requesterEmail: booking.email || "",
    bookingId: booking.bookingId,
    baseUrl: window.location.origin,
  };

  try {
    const res = await fetch("/api/send-booking-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "api_send_failed");
    }

    const notifications = load(storageKeys.notifications, []);
    notifications.push({
      to: responsible.email,
      subject: `ยืนยันการจองห้อง ${booking.room} วันที่ ${booking.date}`,
      createdAt: new Date().toISOString(),
      bookingId: booking.bookingId || booking.createdAt,
      channel: "api",
    });
    save(storageKeys.notifications, notifications);
    return { ok: true, via: "api" };
  } catch (err) {
    const subject = encodeURIComponent(`ยืนยันการจองห้อง ${booking.room} วันที่ ${booking.date}`);
    const body = encodeURIComponent(
      `กรุณายืนยันการจองห้อง\n\nผู้ขอ: ${booking.requesterName}\nสมาชิก: ${booking.member1 || "-"}, ${booking.member2 || "-"}\nวัตถุประสงค์: ${booking.purpose}\nวันที่: ${booking.date}\nเวลา: ${booking.timeSlot}\nห้อง: ${booking.room}`
    );
    const mailto = `mailto:${responsible.email}?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
    return { ok: false, via: "mailto", reason: err?.message || "fallback_mailto" };
  }
};

const sendEquipmentReturnEmail = async (responsible, booking) => {
  if (!responsible?.email || !booking?.bookingId) return { ok: false, reason: "missing_data" };
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: booking.name || booking.requesterName || "",
    requesterEmail: booking.email || "",
    item: booking.item || "",
    quantity: booking.quantity || "",
    date: booking.date || "",
    timeSlot: booking.timeSlot || "",
    bookingId: booking.bookingId,
    returnProofImage: booking.returnProofImage || "",
    baseUrl: window.location.origin,
  };
  try {
    const res = await fetch("/api/send-equipment-return-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const sendEquipmentReturnBatchEmail = async (responsible, bookings) => {
  if (!responsible?.email || !Array.isArray(bookings) || !bookings.length) {
    return { ok: false, reason: "missing_data" };
  }
  const payload = {
    responsibleEmail: responsible.email,
    responsibleName: responsible.name,
    requesterName: bookings[0]?.name || bookings[0]?.requesterName || "",
    requesterEmail: bookings[0]?.email || "",
    bookings: bookings.map((b) => ({
      bookingId: b.bookingId,
      item: b.item || "",
      quantity: b.quantity || "",
      date: b.date || "",
      timeSlot: b.timeSlot || "",
    })),
    returnProofImage: bookings[0]?.returnProofImage || "",
    baseUrl: window.location.origin,
  };
  try {
    const res = await fetch("/api/send-equipment-return-batch-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const sendBroadcastEmail = async ({ to, subject, message }) => {
  const recipients = Array.isArray(to)
    ? [...new Set(to.map((v) => String(v || "").trim().toLowerCase()).filter(Boolean))]
    : [];
  if (!recipients.length || !subject || !message) {
    return { ok: false, reason: "missing_data" };
  }
  try {
    const res = await fetch("/api/send-broadcast-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipients, subject, message }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "send_failed");
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err?.message || "send_failed" };
  }
};

const pickReturnProofImage = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("capture", "environment");
  return new Promise((resolve) => {
    input.addEventListener(
      "change",
      async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve("");
          return;
        }
        try {
          const dataUrl = await fileToDataUrl(file);
          resolve(String(dataUrl || ""));
        } catch {
          resolve("");
        }
      },
      { once: true }
    );
    input.click();
  });
};

const askReturnProofViaModal = async () => {
  const modal = byId("equipmentReturnModal");
  const input = byId("equipmentReturnProofInput");
  const previewWrap = byId("equipmentReturnProofPreviewWrap");
  const preview = byId("equipmentReturnProofPreview");
  const confirmBtn = byId("equipmentReturnConfirmBtn");
  const cancelBtn = byId("equipmentReturnCancelBtn");
  if (!modal || !input || !previewWrap || !preview || !confirmBtn || !cancelBtn) {
    return pickReturnProofImage();
  }
  input.value = "";
  preview.src = "";
  previewWrap.hidden = true;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  return new Promise((resolve) => {
    let proofImage = "";
    const cleanup = () => {
      modal.hidden = true;
      document.body.classList.remove("no-scroll");
      input.removeEventListener("change", onChange);
      confirmBtn.removeEventListener("click", onConfirm);
      cancelBtn.removeEventListener("click", onCancel);
    };
    const onChange = async () => {
      const file = input.files?.[0];
      if (!file) {
        proofImage = "";
        preview.src = "";
        previewWrap.hidden = true;
        return;
      }
      try {
        proofImage = await fileToDataUrl(file);
        preview.src = proofImage;
        previewWrap.hidden = false;
      } catch {
        proofImage = "";
        preview.src = "";
        previewWrap.hidden = true;
      }
    };
    const onConfirm = () => {
      if (!proofImage) {
        alert(t("equipmentReturnProofRequired"));
        return;
      }
      cleanup();
      resolve(proofImage);
    };
    const onCancel = () => {
      cleanup();
      resolve("");
    };
    input.addEventListener("change", onChange);
    confirmBtn.addEventListener("click", onConfirm);
    cancelBtn.addEventListener("click", onCancel);
  });
};

const requestEquipmentReturn = async (bookingId, options = {}) => {
  const silent = Boolean(options.silent);
  const me = getCurrentUser();
  if (!me) return { ok: false, reason: "no_user" };
  const list = load(storageKeys.equipmentBookings, []);
  const index = list.findIndex((b) => b.bookingId === bookingId);
  if (index < 0) return { ok: false, reason: "not_found" };
  const item = list[index];
  if ((item.returnStatus || "borrowed") !== "borrowed") return { ok: false, reason: "invalid_status" };
  const responsible =
    getResponsibleStaff().find((s) => s.id === item.responsibleId) || getResponsibleStaff()[0];
  if (!item.responsibleId && responsible?.id) {
    item.responsibleId = responsible.id;
    save(storageKeys.equipmentBookings, list);
  }
  const proofImage =
    options.proofImage ||
    (options.askProofInModal ? await askReturnProofViaModal() : await pickReturnProofImage());
  if (!proofImage) {
    if (!silent) alert(t("equipmentReturnProofRequired"));
    return { ok: false, reason: "proof_required" };
  }
  item.returnProofImage = proofImage;
  item.returnProofAt = new Date().toISOString();
  item.returnBatchId = item.returnBatchId || `eqret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const result = await sendEquipmentReturnEmail(responsible, item);
  if (!result.ok) {
    if (!silent) alert(`${t("equipmentReturnFailed")} (${result.reason || "unknown"})`);
    return { ok: false, reason: result.reason || "send_failed" };
  }
  item.returnStatus = "return_requested";
  item.returnRequestedAt = new Date().toISOString();
  save(storageKeys.equipmentBookings, list);
  if (!silent) alert(`${t("equipmentReturnConfirmSent")} | ${t("equipmentReturnRequested")}`);
  renderProfilePage();
  renderEquipmentCatalog();
  renderAdminEquipmentBorrowSummary();
  return { ok: true };
};

const requestMultipleEquipmentReturns = async (bookingIds, options = {}) => {
  if (!Array.isArray(bookingIds) || !bookingIds.length) return;
  const me = getCurrentUser();
  if (!me) return;
  const list = load(storageKeys.equipmentBookings, []);
  const selected = list.filter((b) => bookingIds.includes(b.bookingId));
  if (!selected.length) return;

  const targetResponsibleId = selected[0].responsibleId || "";
  const sameResponsible = selected.every((b) => (b.responsibleId || "") === targetResponsibleId);
  if (!sameResponsible) {
    alert(t("equipmentReturnMixedResponsible"));
    return;
  }
  const responsible =
    getResponsibleStaff().find((s) => s.id === targetResponsibleId) || getResponsibleStaff()[0];
  const borrowedOnly = selected.filter((b) => (b.returnStatus || "borrowed") === "borrowed");
  if (!borrowedOnly.length) return;
  const batchId = `eqret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const proofImage = options.askProofInModal
    ? await askReturnProofViaModal()
    : await pickReturnProofImage();
  if (!proofImage) {
    alert(t("equipmentReturnProofRequired"));
    return;
  }
  borrowedOnly.forEach((b) => {
    b.returnProofImage = proofImage;
    b.returnProofAt = new Date().toISOString();
    b.returnBatchId = batchId;
  });

  const result = await sendEquipmentReturnBatchEmail(responsible, borrowedOnly);
  if (!result.ok) {
    alert(`${t("equipmentReturnFailed")} (${result.reason || "unknown"})`);
    return;
  }

  borrowedOnly.forEach((b) => {
    b.returnStatus = "return_requested";
    b.returnRequestedAt = new Date().toISOString();
  });
  save(storageKeys.equipmentBookings, list);
  alert(`${t("equipmentReturnConfirmSent")} | ${t("equipmentReturnRequested")}`);
  renderProfilePage();
  renderEquipmentCatalog();
  renderAdminEquipmentBorrowSummary();
};

const syncEquipmentReturns = async () => {
  try {
    const res = await fetch("/api/confirmed-equipment-returns");
    if (!res.ok) return;
    const body = await res.json();
    if (!Array.isArray(body.items)) return;
    const map = new Map(body.items.map((i) => [i.bookingId, i]));
    const list = load(storageKeys.equipmentBookings, []);
    let changed = false;
    list.forEach((b) => {
      const hit = map.get(b.bookingId);
      if (!hit) return;
      if (b.returnStatus !== "returned") {
        b.returnStatus = "returned";
        b.returnedAt = hit.confirmedAt || new Date().toISOString();
        changed = true;
      }
    });
    if (changed) save(storageKeys.equipmentBookings, list);
    if (changed) renderAdminEquipmentBorrowSummary();
  } catch {
    // API may be unavailable on static host.
  }
};

const registerForm = () => {
  const form = byId("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = byId("regName").value.trim();
    const studentId = byId("regStudentId").value.trim();
    const year = byId("regYear").value.trim();
    const school = byId("regSchool").value.trim();
    const major = byId("regMajor").value.trim();
    const phone = byId("regPhone").value.trim();
    const username = byId("regUsername").value.trim();
    const email = byId("regEmail").value.trim().toLowerCase();
    const password = byId("regPassword").value.trim();
    const profileFile = byId("regProfileImage")?.files?.[0];
    const notice = byId("registerNotice");

    if (!name || !studentId || !year || !school || !major || !phone || !username || !email || !password) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }

    const users = load(storageKeys.users);
    if (users.some((u) => u.email === email)) {
      setNotice(notice, t("emailUsed"), "error");
      return;
    }
    if (users.some((u) => (u.username || "").toLowerCase() === username.toLowerCase())) {
      setNotice(notice, t("usernameUsed"), "error");
      return;
    }
    if (users.some((u) => (u.studentId || "").toLowerCase() === studentId.toLowerCase())) {
      setNotice(notice, t("studentIdUsed"), "error");
      return;
    }

    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    let profileImage = "";
    if (profileFile) {
      try {
        profileImage = await fileToDataUrl(profileFile);
      } catch {
        profileImage = "";
      }
    }
    users.push({
      name,
      studentId,
      year,
      school,
      major,
      phone,
      profileImage,
      username,
      email,
      password,
      verified: false,
      verificationCode,
      role: "user",
      roomQuotaDaily: 1,
      roomQuotaWeekly: 3,
    });
    save(storageKeys.users, users);

    setNotice(notice, t("registerSuccess", { code: verificationCode }));
    form.reset();
  });
};

const verifyForm = () => {
  const form = byId("verifyForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = byId("verifyEmail").value.trim().toLowerCase();
    const code = byId("verifyCode").value.trim();
    const notice = byId("verifyNotice");

    const users = load(storageKeys.users);
    const user = users.find((u) => u.email === email);

    if (!user) {
      setNotice(notice, t("userNotFound"), "error");
      return;
    }

    if (user.verificationCode !== code) {
      setNotice(notice, t("verifyWrong"), "error");
      return;
    }

    user.verified = true;
    save(storageKeys.users, users);
    setNotice(notice, t("verifySuccess"));
    form.reset();
  });
};

const refreshSessionLabel = () => {
  const current = byId("currentSession");
  const logoutBtn = byId("logoutBtn");
  if (!current) return;
  const user = getCurrentUser();
  if (logoutBtn) logoutBtn.hidden = !user;
  current.textContent = user
    ? t("sessionText", { username: user.username, role: roleLabel(user.role) })
    : t("notLogin");
};

const loginForm = () => {
  const form = byId("loginForm");
  if (!form) return;

  refreshSessionLabel();

  byId("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.session);
    setNotice(byId("loginNotice"), t("logoutSuccess"));
    refreshSessionLabel();
    lockAdminUiImmediately();
    setupAdminNav();
    setupAuthNav();
    ensureAdminAccess();
    updateBookingAuthUI();
    updateNavAuthState();
    renderAnnouncements();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const loginId = byId("loginEmail").value.trim();
    const password = byId("loginPassword").value.trim();
    const notice = byId("loginNotice");

    const users = load(storageKeys.users);
    const user = users.find(
      (u) =>
        ((u.email || "").toLowerCase() === loginId.toLowerCase() ||
          (u.username || "").toLowerCase() === loginId.toLowerCase()) &&
        u.password === password
    );

    if (!user) {
      setNotice(notice, t("loginFail"), "error");
      return;
    }

    if (!user.verified) {
      setNotice(notice, t("notVerified"), "error");
      return;
    }

    save(storageKeys.session, {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString(),
    });

    setNotice(notice, t("loginSuccess"));
    refreshSessionLabel();
    form.reset();
    setupAdminNav();
    setupAuthNav();
    ensureAdminAccess();
    updateBookingAuthUI();
    updateNavAuthState();
    renderAnnouncements();
    if (isCurrentPage("login.html")) {
      location.href = "index.html";
    }
  });
};

const bookingForm = ({ formId, noticeId, key, mapData }) => {
  const form = byId(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = mapData();
    const notice = byId(noticeId);
    if (
      (key === storageKeys.roomBookings || key === storageKeys.equipmentBookings) &&
      !getCurrentUser()
    ) {
      setNotice(notice, t("loginRequiredToBook"), "error");
      return;
    }
    let hasEmpty = false;
    if (key === storageKeys.roomBookings) {
      hasEmpty = !String(data.requesterName || "").trim() ||
        !String(data.date || "").trim() ||
        !String(data.timeSlot || "").trim() ||
        !String(data.purpose || "").trim();
    } else if (key === storageKeys.equipmentBookings) {
      hasEmpty =
        !String(data.name || "").trim() ||
        !String(data.item || "").trim() ||
        !String(data.quantity || "").trim() ||
        !String(data.date || "").trim() ||
        !String(data.timeSlot || "").trim() ||
        !String(data.responsibleId || "").trim();
    } else {
      hasEmpty = Object.values(data).some((v) => !String(v).trim());
    }
    if (hasEmpty) {
      setNotice(notice, t("fillAll"), "error");
      return;
    }

    if (key === storageKeys.roomBookings) {
      if (!String(data.responsibleId || "").trim()) {
        setNotice(notice, t("responsibleRequired"), "error");
        return;
      }
      const currentUser = getCurrentUser();
      const quota = getRoomQuota(currentUser);
      const myBookings = load(storageKeys.roomBookings, [])
        .filter((b) => isBookingOwnedByUser(b, currentUser))
        .filter((b) => b.status !== "rejected");
      const dayCount = myBookings.filter((b) => b.date === data.date).length;
      if (dayCount >= quota.daily) {
        setNotice(notice, t("roomLimitPerDayQuota", { limit: quota.daily }), "error");
        return;
      }
      const selectedWeek = weekKey(data.date);
      const weekCount = myBookings.filter((b) => weekKey(b.date) === selectedWeek).length;
      if (weekCount >= quota.weekly) {
        setNotice(notice, t("roomLimitPerWeekQuota", { limit: quota.weekly }), "error");
        return;
      }
      const selected = {
        room: String(data.room || ""),
        date: String(data.date || ""),
        timeSlot: String(data.timeSlot || ""),
      };
      const slotCount = roomBookingsBySelection(selected).reduce(
        (sum, b) => sum + Number(b.participantCount || 1),
        0
      );
      const nextCount = Number(data.participantCount || 1);
      if (slotCount + nextCount > 20) {
        setNotice(notice, t("roomFull"), "error");
        renderRoomSlots();
        return;
      }
    }
    if (key === storageKeys.equipmentBookings) {
      if (!String(data.responsibleId || "").trim()) {
        setNotice(notice, t("responsibleRequired"), "error");
        return;
      }
      if (!String(data.itemId || "").trim()) {
        setNotice(notice, t("fillAll"), "error");
        return;
      }
      const me = getCurrentUser();
      const matched = load(storageKeys.roomBookings, [])
        .filter((b) => b.status === "approved")
        .filter((b) => isBookingOwnedByUser(b, me))
        .some((b) => b.date === data.date && b.timeSlot === data.timeSlot);
      if (!matched) {
        setNotice(notice, t("equipmentNeedRoom"), "error");
        return;
      }
      const available = getAvailableQtyByItemId(data.itemId);
      const needed = Math.max(1, Number(data.quantity || 1));
      if (available <= 0 || needed > available) {
        setNotice(notice, t("equipmentOutOfStock"), "error");
        return;
      }
    }

    const list = load(key);
    const base = { ...data, createdAt: new Date().toISOString() };
    if (key === storageKeys.roomBookings) {
      base.bookingId = base.bookingId || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    if (key === storageKeys.equipmentBookings) {
      base.bookingId = base.bookingId || `eqb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      base.returnStatus = base.returnStatus || "borrowed";
    }
    if (key === storageKeys.roomBookings) {
      base.status = "pending";
      base.approvedBy = "-";
    }
    list.push(base);
    save(key, list);

    setNotice(notice, t("bookingSaved"));
    if (key === storageKeys.roomBookings) {
      const responsible = getResponsibleStaff().find((s) => s.id === base.responsibleId);
      const mailResult = await sendResponsibleEmailDraft(responsible, base);
      setNotice(
        notice,
        mailResult.ok
          ? `${t("bookingSaved")} | ${t("emailSent")}`
          : `${t("bookingSaved")} | ${t("emailNotify")} (${mailResult.reason || "fallback"})`
      );
    }
    form.reset();
    if (key === storageKeys.roomBookings) {
      const hidden = byId("selectedResponsibleId");
      if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
    }
    if (key === storageKeys.equipmentBookings) {
      const hidden = byId("eqSelectedResponsibleId");
      if (hidden) hidden.value = getResponsibleStaff()[0]?.id || "";
      selectedEquipmentItemId = "";
      syncEquipmentEligibility();
    }
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderResponsibleOptions();
    renderEqResponsibleOptions();
    renderProfilePage();
    renderAdminUserProfilePanel();
  });
};

const renderRoomApproval = () => {
  const target = byId("roomApproveList");
  if (!target) return;

  const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
  target.innerHTML = rooms.length
    ? rooms
        .map((r, index) => {
          const status = r.status || "pending";
          const bookingEnded = isBookingPastEndTime(r);
          const canApprove = !bookingEnded && status !== "approved";
          const canReject = !bookingEnded && status !== "rejected";
          return `<div class="admin-item">
            <div>
              <p><strong>${r.room}</strong> · ${r.date} ${r.timeSlot}</p>
              <p class="muted">${t("booker")}: ${r.name} | ${t("purpose")}: ${r.purpose}</p>
              <p class="muted"><span class="pill ${statusClass(status)}">${statusLabel(status)}</span> | ${t("approvedBy")}: ${r.approvedBy || "-"}</p>
            </div>
            ${
              bookingEnded
                ? ""
                : `<div class="feed-actions-end inline-actions">
                    <button type="button" class="btn-small" data-approve-room="${index}" ${canApprove ? "" : "disabled"}>${t("statusApproved")}</button>
                    <button type="button" class="btn-small danger" data-reject-room="${index}" ${canReject ? "" : "disabled"}>${t("statusRejected")}</button>
                  </div>`
            }
          </div>`;
        })
        .join("")
    : `<p class="muted">${t("roomApprovalEmpty")}</p>`;
};

const getBroadcastRecipientsByGroup = (group = "all") => {
  const users = load(storageKeys.users, []);
  const staff = getResponsibleStaff();
  const map = new Map();
  const pushUnique = (entry) => {
    const email = String(entry.email || "").trim().toLowerCase();
    if (!email || map.has(email)) return;
    map.set(email, { ...entry, email });
  };

  if (group === "all" || group === "users") {
    users
      .filter((u) => u.role !== "admin")
      .forEach((u) =>
        pushUnique({
          email: u.email || "",
          name: u.name || u.username || "",
          kind: "user",
        })
      );
  }
  if (group === "all" || group === "staff") {
    staff.forEach((s) =>
      pushUnique({
        email: s.email || "",
        name: s.name || "",
        kind: "staff",
      })
    );
  }
  return [...map.values()];
};

const renderBroadcastRecipientList = () => {
  const box = byId("broadcastRecipientList");
  const groupSelect = byId("broadcastGroup");
  if (!box || !groupSelect) return;
  const group = groupSelect.value || "all";
  const recipients = getBroadcastRecipientsByGroup(group);
  const prevChecked = new Set(
    Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map((el) => el.value)
  );
  box.innerHTML = recipients.length
    ? recipients
        .map((r) => {
          const checked = prevChecked.size ? prevChecked.has(r.email) : true;
          const kindText =
            r.kind === "staff" ? t("adminBroadcastTargetStaff") : t("adminBroadcastTargetUser");
          return `<label class="recipient-item"><input type="checkbox" value="${r.email}" ${checked ? "checked" : ""} /> <span><strong>${r.name || "-"}</strong> (${kindText})<br>${r.email}</span></label>`;
        })
        .join("")
    : `<p class="muted">${t("recentEmpty")}</p>`;
};

const renderAdminEquipmentBorrowSummary = () => {
  const target = byId("adminEquipmentSummary");
  if (!target) return;

  const equipmentList = load(storageKeys.equipmentBookings, []);
  const roomList = load(storageKeys.roomBookings, []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const staffMap = new Map(getResponsibleStaff().map((s) => [String(s.id || ""), s]));
  const outstanding = equipmentList
    .filter((b) => (b.returnStatus || "borrowed") !== "returned")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const equipmentHtml = (() => {
    if (!outstanding.length) return `<p class="muted">${t("adminBorrowEmpty")}</p>`;
    const byItem = new Map();
    outstanding.forEach((b) => {
      const key = b.item || "-";
      byItem.set(key, (byItem.get(key) || 0) + 1);
    });
    const summaryRows = [...byItem.entries()]
      .map(([item, count]) => `<li>${item}: ${count}</li>`)
      .join("");
    return `
      <div class="admin-item">
        <div>
          <p><strong>${t("adminBorrowByItem")}</strong></p>
          <ul class="list">${summaryRows}</ul>
        </div>
        <div>
          <p class="muted">${t("adminBorrowOutstandingCount", { count: outstanding.length })}</p>
        </div>
      </div>
      <div class="admin-summary-scroll">
        ${outstanding
          .map((b) => {
            const canRemind = Boolean(String(b.email || "").trim());
            const owner = b.name || b.requesterName || b.username || "-";
            return `<div class="admin-item">
              <div>
                <p><strong>${b.item || "-"}</strong> x ${b.quantity || "-"}</p>
                <p class="muted">${t("adminBorrowUser")}: ${owner} | ${b.email || "-"}</p>
              <p class="muted">${t("adminBorrowDate")}: ${b.date || "-"} ${b.timeSlot ? `| ${b.timeSlot}` : ""}</p>
              <p class="muted">${t("adminBorrowStatus")}: <span class="pill ${b.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(b.returnStatus || "borrowed")}</span></p>
              ${
                b.returnProofImage
                  ? `<p class="muted">${t("equipmentReturnProofLabel")}:</p><img class="return-proof-thumb" src="${b.returnProofImage}" alt="return-proof" />`
                  : ""
              }
            </div>
              <div>
                <button type="button" class="btn-small danger" data-remind-return="${b.bookingId || ""}" ${canRemind ? "" : "disabled"}>${t("adminBorrowRemindBtn")}</button>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    `;
  })();

  const roomHtml = (() => {
    if (!roomList.length) return `<p class="muted">${t("adminRoomSummaryEmpty")}</p>`;
    const pendingCount = roomList.filter((r) => (r.status || "pending") === "pending").length;
    const approvedCount = roomList.filter((r) => (r.status || "pending") === "approved").length;
    const rejectedCount = roomList.filter((r) => (r.status || "pending") === "rejected").length;

    return `
      <div class="admin-item">
        <div>
          <p><strong>${t("adminRoomSummaryTitle")}</strong></p>
          <p class="muted">${t("adminRoomSummaryHint")}</p>
        </div>
        <div>
          <p class="muted">${t("adminRoomPendingCount", { count: pendingCount })}</p>
          <p class="muted">${t("adminRoomApprovedCount", { count: approvedCount })}</p>
          <p class="muted">${t("adminRoomRejectedCount", { count: rejectedCount })}</p>
        </div>
      </div>
      <div class="admin-summary-scroll">
        ${roomList
          .map((r) => {
            const status = r.status || "pending";
            const responsible = staffMap.get(String(r.responsibleId || ""));
            const requester = r.requesterName || r.name || r.username || "-";
            return `<div class="admin-item">
              <div>
                <p><strong>${r.room || "Lab-F11"}</strong> · ${r.date || "-"} ${r.timeSlot || "-"}</p>
                <p class="muted">${t("booker")}: ${requester} | ${t("purpose")}: ${r.purpose || "-"}</p>
                <p class="muted">${t("adminRoomMembers")}: ${(r.member1 || "-")}, ${(r.member2 || "-")}</p>
                <p class="muted">${t("adminRoomResponsible")}: ${responsible?.name || "-"}</p>
                <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(status)}">${statusLabel(status)}</span> | ${t("approvedBy")}: ${r.approvedBy || "-"}</p>
              </div>
            </div>`;
          })
          .join("")}
      </div>
    `;
  })();

  target.innerHTML = `
    ${equipmentHtml}
    <hr />
    ${roomHtml}
  `;
};

const renderAdminUsers = () => {
  const target = byId("adminUserList");
  if (!target) return;
  const users = load(storageKeys.users);

  target.innerHTML = users
    .map((u, index) => {
      const isVerified = Boolean(u.verified);
      const verifyText = isVerified ? t("verifiedMemberBtn") : t("verifyMemberBtn");
      const verifyClass = isVerified ? "btn-small success" : "btn-small";
      return `<div class="admin-item">
        <div>
          <p><strong>${u.name}</strong> (${u.username})</p>
          <p class="muted">${u.email} | verify: ${u.verified ? t("verifiedYes") : t("verifiedNo")} | role: ${roleLabel(u.role)}</p>
          <p class="muted">${u.studentId ? t("adminUserMeta", { studentId: u.studentId, year: u.year || "-", school: u.school || "-", major: u.major || "-", phone: u.phone || "-" }) : ""}</p>
        </div>
        <div>
          <button type="button" class="${verifyClass}" data-verify-user="${index}" ${isVerified ? "disabled" : ""}>${verifyText}</button>
          <button type="button" class="btn-small" data-view-user-profile="${index}">${t("viewProfileBtn")}</button>
        </div>
      </div>`;
    })
    .join("");
};

let selectedAdminUserProfileKey = "";
let selectedAdminQuotaUserIndex = -1;

const closeAdminQuotaModal = () => {
  const modal = byId("adminQuotaModal");
  const form = byId("adminQuotaForm");
  const notice = byId("adminQuotaNotice");
  if (modal) modal.hidden = true;
  if (form) form.reset();
  if (notice) notice.hidden = true;
  selectedAdminQuotaUserIndex = -1;
};

const openAdminQuotaModal = (index) => {
  const users = load(storageKeys.users, []);
  const user = users[index];
  if (!user) return;
  const modal = byId("adminQuotaModal");
  const target = byId("adminQuotaTargetName");
  const currentText = byId("adminQuotaCurrentText");
  const amountInput = byId("adminQuotaAmountInput");
  if (!modal || !target || !currentText || !amountInput) return;
  const quota = getRoomQuota(user);
  selectedAdminQuotaUserIndex = index;
  target.textContent = `${user.name || "-"} (${user.username || "-"})`;
  currentText.textContent = t("adminQuotaCurrent", { daily: quota.daily, weekly: quota.weekly });
  amountInput.value = "1";
  modal.hidden = false;
};

const setupAdminQuotaModal = () => {
  const modal = byId("adminQuotaModal");
  const form = byId("adminQuotaForm");
  const cancelBtn = byId("adminQuotaCancelBtn");
  const amountInput = byId("adminQuotaAmountInput");
  if (!modal || !form || form.dataset.bound) return;
  form.dataset.bound = "1";

  cancelBtn?.addEventListener("click", closeAdminQuotaModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAdminQuotaModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const users = load(storageKeys.users, []);
    const index = selectedAdminQuotaUserIndex;
    if (index < 0 || !users[index]) return;
    const raw = Number(amountInput?.value || 0);
    const amount = Math.floor(raw);
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice(byId("adminQuotaNotice"), t("fillAll"), "error");
      return;
    }
    const current = getRoomQuota(users[index]);
    users[index].roomQuotaWeekly = current.weekly + amount;
    users[index].roomQuotaDaily = current.daily;
    save(storageKeys.users, users);
    setNotice(
      byId("adminNotice"),
      t("adminAddQuotaSaved", {
        name: users[index].name || users[index].username || "-",
        weekly: users[index].roomQuotaWeekly,
      })
    );
    closeAdminQuotaModal();
    renderAdminUsers();
    renderAdminUserProfilePanel();
    renderProfilePage();
  });
};

const renderAdminUserProfilePanel = () => {
  const panel = byId("adminUserProfilePanel");
  const title = byId("adminUserProfileTitle");
  const view = byId("adminUserProfileView");
  if (!panel || !view) return;
  if (title) title.textContent = t("adminProfileTitle");

  const users = load(storageKeys.users, []);
  let user =
    users.find((u) => (u.username || u.email) === selectedAdminUserProfileKey) ||
    users.find((u) => u.username === selectedAdminUserProfileKey);
  if (!user) {
    panel.hidden = false;
    view.innerHTML = `<p class="muted">${t("adminProfileEmpty")}</p>`;
    return;
  }

  const roomList = load(storageKeys.roomBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const eqList = load(storageKeys.equipmentBookings, [])
    .filter((b) => isBookingOwnedByUser(b, user))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const userIndex = users.findIndex(
    (u) =>
      (u.username || u.email) === (user.username || user.email) ||
      u.username === user.username
  );
  const quota = getRoomQuota(user);
  const isAdminUser = user.role === "admin";

  panel.hidden = false;
  view.innerHTML = `
    <div class="admin-user-profile-wrap">
      <div class="admin-user-profile-head">
        <img src="${user.profileImage || "image/IconLab.png"}" alt="${user.name || user.username}" />
        <div>
          <p><strong>${user.name || "-"}</strong> (${user.username || "-"})</p>
          <p class="muted">${user.email || "-"}</p>
          <p class="muted">${t("adminUserMeta", { studentId: user.studentId || "-", year: user.year || "-", school: user.school || "-", major: user.major || "-", phone: user.phone || "-" })}</p>
          <p class="muted">${t("adminQuotaLabel", { daily: quota.daily, weekly: quota.weekly })}</p>
        </div>
      </div>
      <div class="inline-actions">
        <button type="button" class="btn-small" data-add-quota-user="${userIndex}">${t("adminAddQuotaBtn")}</button>
        <button type="button" class="btn-small" data-promote-user="${userIndex}" ${isAdminUser ? "disabled" : ""}>${t("navAdmin")}</button>
        <button type="button" class="btn-small danger" data-delete-user="${userIndex}">${t("deleteUserBtn")}</button>
      </div>
      <h4>${t("adminProfileRoomHistory")} (${roomList.length})</h4>
      <div class="admin-user-profile-list">
        ${
          roomList.length
            ? roomList
                .map(
                  (r) => `<div class="feed-item">
                    <p class="feed-meta">${new Date(r.createdAt).toLocaleString(localeByLang())}</p>
                    <p><strong>${r.room || "Lab-F11"}</strong> | ${r.date || "-"} | ${r.timeSlot || "-"}</p>
                    <p class="muted">${t("profilePurpose")}: ${r.purpose || "-"}</p>
                    <p class="muted">${t("profileStatus")}: <span class="pill ${statusClass(r.status || "pending")}">${statusLabel(r.status || "pending")}</span></p>
                  </div>`
                )
                .join("")
            : `<p class="muted">${t("profileNoRoomBookings")}</p>`
        }
      </div>
      <h4 style="margin-top:0.7rem;">${t("adminProfileEquipmentHistory")} (${eqList.length})</h4>
      <div class="admin-user-profile-list">
        ${
          eqList.length
            ? eqList
                .map(
                  (e) => `<div class="feed-item">
                    <p class="feed-meta">${new Date(e.createdAt).toLocaleString(localeByLang())}</p>
                    <p><strong>${e.item || "-"}</strong> ${t("profileQty")} ${e.quantity || "-"}</p>
                    <p class="muted">${t("profileUsageDate")}: ${e.date || "-"} ${e.timeSlot ? `| ${e.timeSlot}` : ""}</p>
                    <p class="muted">${t("profileDetail")}: ${e.detail || "-"}</p>
                    <p class="muted">${t("profileStatus")}: <span class="pill ${e.returnStatus === "returned" ? "approved" : e.returnStatus === "return_requested" ? "pending" : ""}">${equipmentReturnStatusLabel(e.returnStatus || "borrowed")}</span></p>
                  </div>`
                )
                .join("")
            : `<p class="muted">${t("profileNoEquipmentBookings")}</p>`
        }
      </div>
    </div>
  `;
};

const renderAdminAnnouncements = () => {
  const target = byId("adminAnnouncementList");
  if (!target) return;
  const announcements = load(storageKeys.announcements).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  target.innerHTML = announcements.length
    ? `<div class="admin-announce-grid">${announcements
        .map(
          (a, index) => `<div class="admin-announce-card">
            ${a.image ? `<img class="feed-image" src="${a.image}" alt="${a.title}" />` : ""}
            <p class="admin-announce-title"><strong>${a.title}</strong></p>
            <p class="admin-announce-type"><span class="pill approved">${announcementTypeLabel(a.type)}</span></p>
            <p class="muted admin-announce-content">${a.content}</p>
            <p class="muted admin-announce-meta">${a.author} | ${new Date(a.createdAt).toLocaleString(localeByLang())}</p>
            <div class="feed-actions-end">
              <button type="button" class="btn-small danger" data-delete-announcement="${index}">Delete</button>
            </div>
          </div>`
        )
        .join("")}</div>`
    : `<p class="muted">${t("adminAnnouncementEmpty")}</p>`;
};

const setupAdminSectionTabs = () => {
  if (!isCurrentPage("admin.html")) return;
  const tabButtons = Array.from(document.querySelectorAll("[data-admin-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-admin-panel]"));
  if (!tabButtons.length || !panels.length) return;

  const applyTab = (tabKey) => {
    const next = String(tabKey || "").trim();
    const fallback = tabButtons[0]?.dataset.adminTab || "";
    const selected = tabButtons.some((btn) => btn.dataset.adminTab === next) ? next : fallback;
    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.adminTab === selected);
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.adminPanel !== selected;
    });
  };

  const hashTab = String(location.hash || "").replace("#admin-", "").trim();
  applyTab(hashTab);

  tabButtons.forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const tabKey = btn.dataset.adminTab || "";
      applyTab(tabKey);
      if (tabKey) {
        const nextHash = `#admin-${tabKey}`;
        if (location.hash !== nextHash) history.replaceState(null, "", nextHash);
      }
    });
  });
};

const adminActions = () => {
  if (!isCurrentPage("admin.html")) return;
  if (!isAdminSession()) return;
  setupAdminSectionTabs();

  const form = byId("announcementForm");
  const broadcastForm = byId("adminBroadcastForm");
  const broadcastGroup = byId("broadcastGroup");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!requireAdminAction()) return;
    const type = byId("announceType").value;
    const title = byId("announceTitle").value.trim();
    const content = byId("announceContent").value.trim();
    const notice = byId("adminNotice");
    const session = getSession();

    if (!type || !title || !content) {
      setNotice(notice, t("adminTypeMissing"), "error");
      return;
    }
    if (!cropState.croppedDataUrl) {
      setNotice(notice, t("imageRequired"), "error");
      return;
    }

    const list = load(storageKeys.announcements);
    list.push({
      type: normalizeAnnouncementType(type),
      title,
      content,
      image: cropState.croppedDataUrl,
      createdAt: new Date().toISOString(),
      author: session.username,
    });
    save(storageKeys.announcements, list);

    setNotice(notice, t("adminPostSaved"));
    form.reset();
    cropState.image = null;
    cropState.zoom = 1;
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    cropState.croppedDataUrl = "";
    const cropStatus = byId("cropStatus");
    if (cropStatus) cropStatus.textContent = t("cropEmpty");
    const cropZoom = byId("cropZoom");
    const cropX = byId("cropX");
    const cropY = byId("cropY");
    if (cropZoom) cropZoom.value = "1";
    if (cropX) cropX.value = "0";
    if (cropY) cropY.value = "0";
    drawCropCanvas();
    renderAdminAnnouncements();
    renderAnnouncements();
  });

  if (broadcastGroup && !broadcastGroup.dataset.bound) {
    broadcastGroup.dataset.bound = "1";
    broadcastGroup.addEventListener("change", () => {
      renderBroadcastRecipientList();
    });
  }

  if (broadcastForm && !broadcastForm.dataset.bound) {
    broadcastForm.dataset.bound = "1";
    broadcastForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!requireAdminAction()) return;
      const notice = byId("adminBroadcastNotice");
      const subject = byId("broadcastSubject")?.value?.trim() || "";
      const message = byId("broadcastMessage")?.value?.trim() || "";
      if (!subject || !message) {
        setNotice(notice, t("adminBroadcastNoMessage"), "error");
        return;
      }
      const recipients = Array.from(
        document.querySelectorAll('#broadcastRecipientList input[type="checkbox"]:checked')
      )
        .map((el) => String(el.value || "").trim().toLowerCase())
        .filter(Boolean);
      if (!recipients.length) {
        setNotice(notice, t("adminBroadcastNoRecipients"), "error");
        return;
      }
      const result = await sendBroadcastEmail({ to: recipients, subject, message });
      if (!result.ok) {
        setNotice(notice, `${t("equipmentReturnFailed")} (${result.reason || "send_failed"})`, "error");
        return;
      }
      setNotice(notice, `${t("adminBroadcastSent")} (${recipients.length})`);
    });
  }

  document.addEventListener("click", (e) => {
    if (!requireAdminAction()) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.approveRoom !== undefined) {
      const index = Number(target.dataset.approveRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "approved";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      renderRoomApproval();
      renderDashboard();
      renderAdminUserProfilePanel();
      renderProfilePage();
      renderRoomSlots();
      return;
    }

    if (target.dataset.rejectRoom !== undefined) {
      const index = Number(target.dataset.rejectRoom);
      const rooms = sortRoomBookingsByUsageDesc(load(storageKeys.roomBookings));
      if (!rooms[index]) return;
      if (isBookingPastEndTime(rooms[index])) return;

      rooms[index].status = "rejected";
      rooms[index].approvedBy = getSession().username;
      save(storageKeys.roomBookings, rooms);
      renderRoomApproval();
      renderDashboard();
      renderAdminUserProfilePanel();
      renderProfilePage();
      renderRoomSlots();
      return;
    }

    if (target.dataset.promoteUser !== undefined) {
      const index = Number(target.dataset.promoteUser);
      const users = load(storageKeys.users);
      if (!users[index]) return;

      users[index].role = "admin";
      users[index].verified = true;
      save(storageKeys.users, users);
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderBroadcastRecipientList();
      return;
    }

    if (target.dataset.addQuotaUser !== undefined) {
      const index = Number(target.dataset.addQuotaUser);
      openAdminQuotaModal(index);
      return;
    }

    if (target.dataset.verifyUser !== undefined) {
      const index = Number(target.dataset.verifyUser);
      const users = load(storageKeys.users);
      if (!users[index]) return;
      users[index].verified = true;
      save(storageKeys.users, users);
      renderAdminUsers();
      renderAdminUserProfilePanel();
      return;
    }

    if (target.dataset.remindReturn !== undefined) {
      const bookingId = String(target.dataset.remindReturn || "").trim();
      const notice = byId("adminEquipmentNotice");
      if (!bookingId) return;
      const list = load(storageKeys.equipmentBookings, []);
      const booking = list.find((b) => String(b.bookingId || "") === bookingId);
      if (!booking) return;
      const recipient = String(booking.email || "").trim().toLowerCase();
      if (!recipient) {
        setNotice(notice, t("adminBorrowNoEmail"), "error");
        return;
      }
      const subject = `แจ้งเตือนคืนอุปกรณ์ ${booking.item || ""}`;
      const message = [
        `สวัสดี ${booking.name || booking.requesterName || booking.username || ""}`,
        "",
        `กรุณาคืนอุปกรณ์: ${booking.item || "-"}`,
        `จำนวน: ${booking.quantity || "-"}`,
        `วันที่ใช้งาน: ${booking.date || "-"}`,
        `เวลา: ${booking.timeSlot || "-"}`,
      ].join("\n");
      sendBroadcastEmail({ to: [recipient], subject, message }).then((result) => {
        if (!result.ok) {
          setNotice(notice, `${t("equipmentReturnFailed")} (${result.reason || "send_failed"})`, "error");
          return;
        }
        setNotice(notice, t("adminBorrowReminderSent"));
      });
      return;
    }

    if (target.dataset.viewUserProfile !== undefined) {
      const index = Number(target.dataset.viewUserProfile);
      const users = load(storageKeys.users);
      const picked = users[index];
      if (!picked) return;
      selectedAdminUserProfileKey = picked.username || picked.email || "";
      renderAdminUserProfilePanel();
      return;
    }

    if (target.dataset.deleteAnnouncement !== undefined) {
      if (!window.confirm(t("confirmDeleteAnnouncement"))) return;
      const index = Number(target.dataset.deleteAnnouncement);
      const list = load(storageKeys.announcements).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      if (!list[index]) return;

      list.splice(index, 1);
      save(storageKeys.announcements, list);
      renderAdminAnnouncements();
      renderAnnouncements();
      return;
    }

    if (target.dataset.deleteResponsible !== undefined) {
      if (!window.confirm(t("confirmDeleteResponsible"))) return;
      const index = Number(target.dataset.deleteResponsible);
      const list = getResponsibleStaff();
      if (!list[index]) return;
      list.splice(index, 1);
      save(storageKeys.responsibleStaff, list);
      renderResponsibleAdminList();
      const selected = byId("selectedResponsibleId");
      if (selected && selected.value && !list.some((s) => s.id === selected.value)) {
        selected.value = list[0]?.id || "";
      }
      renderResponsibleOptions();
      renderEqResponsibleOptions();
      renderBroadcastRecipientList();
      return;
    }

    if (target.dataset.deleteUser !== undefined) {
      if (!window.confirm(t("confirmDeleteUser"))) return;
      const index = Number(target.dataset.deleteUser);
      const users = load(storageKeys.users);
      const selected = users[index];
      if (!selected) return;
      const current = getCurrentUser();
      if (current && current.username === selected.username) {
        alert(t("cannotDeleteSelf"));
        return;
      }
      users.splice(index, 1);
      save(storageKeys.users, users);
      if (selectedAdminUserProfileKey && (selected.username === selectedAdminUserProfileKey || selected.email === selectedAdminUserProfileKey)) {
        selectedAdminUserProfileKey = "";
      }
      renderAdminUsers();
      renderAdminUserProfilePanel();
      renderResponsibleOptions();
      renderEqResponsibleOptions();
      renderBroadcastRecipientList();
    }
  });

  renderRoomApproval();
  renderAdminUsers();
  renderAdminUserProfilePanel();
  renderAdminEquipmentBorrowSummary();
  renderBroadcastRecipientList();
  renderAdminAnnouncements();
  renderResponsibleAdminList();
};

seedAdmin();
seedHomeInfo();
seedResponsibleStaff();
seedEquipmentItems();
seedEquipmentTypes();
migrateLegacyData();
normalizeEquipmentBookingsData();
updateVisitorCounters();
normalizeUsers();
setupClientHardening();
applyTranslations();
setupLanguageSelector();
activeNav();
updateNavAuthState();
setFooterYear();
setupAuthNav();
setupAdminNav();
ensureAdminAccess();
renderAnnouncements();
renderHomeBottomInfo();
renderProfilePage();
registerForm();
verifyForm();
loginForm();
setupRoomBookingUI();
setupEquipmentBookingUI();
updateBookingAuthUI();
setupCropTool();
setupEquipmentCropTool();
refreshCropStatusByState();
adminActions();
setupResponsibleAdmin();
setupEquipmentAdminTools();
setupHomeBottomEditor();
setupAnnouncementEditor();
setupAdminQuotaModal();
bookingForm({
  formId: "roomBookingForm",
  noticeId: "roomNotice",
  key: storageKeys.roomBookings,
  mapData: () => {
    const me = getCurrentUser();
    const requesterName = byId("roomRequesterName")?.value?.trim() || "";
    const member1 = byId("roomMember1")?.value?.trim() || "";
    const member2 = byId("roomMember2")?.value?.trim() || "";
    const purposeType =
      document.querySelector('input[name="roomPurposeType"]:checked')?.value || "";
    const purposeOther = byId("roomPurposeOther")?.value?.trim() || "";
    const purpose =
      purposeType === "อื่นๆ" ? (purposeOther || "อื่นๆ") : purposeType;
    const participantCount =
      [requesterName, member1, member2].filter((v) => Boolean(v)).length || 1;
    return {
      requesterName,
      member1,
      member2,
      name: requesterName,
      username: me?.username || "",
      email: me?.email || "",
      room: byId("roomFixed")?.value || "Lab-F11",
      date: byId("roomDate")?.value || "",
      timeSlot: byId("roomTime")?.value || "",
      purpose,
      purposeType,
      responsibleId: byId("selectedResponsibleId")?.value || "",
      participantCount,
    };
  },
});
Promise.all([syncResponsibleApprovals(), syncEquipmentReturns()]).then(() => {
  renderDashboard();
  renderRoomApproval();
  renderRoomSlots();
  renderProfilePage();
});

setInterval(() => {
  Promise.all([syncResponsibleApprovals(), syncEquipmentReturns()]).then(() => {
    renderDashboard();
    renderRoomApproval();
    renderRoomSlots();
    renderProfilePage();
  });
}, 15000);
