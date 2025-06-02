// 爱情开始日期
const loveStartDate = new Date('2023-09-26T19:00:00');

// 数据存储（使用localStorage模拟数据库）
let memories = JSON.parse(localStorage.getItem('loveMemories')) || [
    {
        id: 1,
        date: '2023-09-26',
        title: '确认关系 💑',
        description: '这一天晚上，郭佳仑和钱海宁正式确认了关系，开始了我们的爱情故事。'
    }
];

let messages = JSON.parse(localStorage.getItem('loveMessages')) || [];
let photos = JSON.parse(localStorage.getItem('lovePhotos')) || [];

// 保存数据到localStorage
function saveData() {
    localStorage.setItem('loveMemories', JSON.stringify(memories));
    localStorage.setItem('loveMessages', JSON.stringify(messages));
    localStorage.setItem('lovePhotos', JSON.stringify(photos));
}

// 更新爱情计数器
function updateLoveCounter() {
    const now = new Date();
    const timeDiff = now - loveStartDate;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days-count').textContent = days;
    document.getElementById('hours-count').textContent = hours;
    document.getElementById('minutes-count').textContent = minutes;
}

// 格式化日期
function formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 格式化时间
function formatDateTime(date) {
    return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 渲染时间轴
function renderTimeline() {
    const timeline = document.querySelector('.timeline');
    // 保留第一个记忆（确认关系）
    const firstMemory = timeline.querySelector('.timeline-item');
    timeline.innerHTML = '';
    timeline.appendChild(firstMemory);
    
    // 按日期排序（最新的在前）
    const sortedMemories = memories.slice(1).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedMemories.forEach((memory, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-date">${memory.date}</div>
            <div class="timeline-content">
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
                <button class="delete-btn" onclick="deleteMemory(${memory.id})" style="margin-top: 1rem; background: #ff6b6b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">删除</button>
            </div>
        `;
        timeline.appendChild(item);
    });
}

// 添加回忆
function addMemory() {
    const modal = document.getElementById('memory-modal');
    modal.style.display = 'block';
}

// 删除回忆
function deleteMemory(id) {
    if (confirm('确定要删除这个回忆吗？')) {
        memories = memories.filter(memory => memory.id !== id);
        saveData();
        renderTimeline();
    }
}

// 渲染留言
function renderMessages() {
    const container = document.getElementById('messages-container');
    container.innerHTML = '';
    
    // 按时间排序（最新的在前）
    const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedMessages.forEach(message => {
        const item = document.createElement('div');
        item.className = 'message-item';
        item.innerHTML = `
            <div class="message-header">
                <span class="message-author">${message.author}</span>
                <span class="message-date">${formatDateTime(message.timestamp)}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <button class="delete-btn" onclick="deleteMessage('${message.id}')" style="margin-top: 1rem; background: #ff6b6b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">删除</button>
        `;
        container.appendChild(item);
    });
}

// 添加留言
function addMessage() {
    const content = document.getElementById('message-input').value.trim();
    const author = document.getElementById('message-author').value;
    
    if (!content) {
        alert('请输入留言内容');
        return;
    }
    
    const message = {
        id: Date.now().toString(),
        content: content,
        author: author,
        timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    saveData();
    renderMessages();
    
    // 清空输入框
    document.getElementById('message-input').value = '';
}

// 删除留言
function deleteMessage(id) {
    if (confirm('确定要删除这条留言吗？')) {
        messages = messages.filter(message => message.id !== id);
        saveData();
        renderMessages();
    }
}

// 渲染照片墙
function renderPhotos() {
    const grid = document.getElementById('photo-grid');
    grid.innerHTML = '';
    
    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.innerHTML = `
            <img src="${photo.url}" alt="${photo.description || '我们的照片'}" onclick="viewPhoto('${photo.url}')">
            <div style="padding: 1rem; background: rgba(255,255,255,0.1); position: relative;">
                <p style="color: white; margin: 0; font-size: 0.9rem;">${photo.description || '美好的回忆'}</p>
                <button onclick="deletePhoto('${photo.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px;">×</button>
            </div>
        `;
        grid.appendChild(item);
    });
}

// 查看照片
function viewPhoto(url) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center; max-width: 80%; max-height: 80%;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${url}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 10px;">
        </div>
    `;
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 删除照片
function deletePhoto(id) {
    if (confirm('确定要删除这张照片吗？')) {
        photos = photos.filter(photo => photo.id !== id);
        saveData();
        renderPhotos();
    }
}

// 处理照片上传
function handlePhotoUpload() {
    const input = document.getElementById('photo-upload');
    input.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photo = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        url: e.target.result,
                        description: `上传于 ${formatDateTime(new Date())}`,
                        timestamp: new Date().toISOString()
                    };
                    
                    photos.push(photo);
                    saveData();
                    renderPhotos();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 清空input
        input.value = '';
    });
}

// 处理模态框
function handleModals() {
    const modal = document.getElementById('memory-modal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('memory-form');
    
    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // 点击背景关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 处理表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('memory-date').value;
        const title = document.getElementById('memory-title').value.trim();
        const description = document.getElementById('memory-description').value.trim();
        
        if (!date || !title || !description) {
            alert('请填写完整信息');
            return;
        }
        
        const memory = {
            id: Date.now(),
            date: date,
            title: title,
            description: description
        };
        
        memories.push(memory);
        saveData();
        renderTimeline();
        
        // 关闭模态框并清空表单
        modal.style.display = 'none';
        form.reset();
    });
}

// 平滑滚动
function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 添加一些示例数据（如果没有数据的话）
function addSampleData() {
    if (messages.length === 0) {
        messages.push(
            {
                id: '1',
                content: '今天和海宁在一起真的很开心！💕',
                author: '郭佳仑',
                timestamp: new Date(Date.now() - 86400000).toISOString() // 1天前
            },
            {
                id: '2',
                content: '我也是！每天都期待着和佳仑见面 😊',
                author: '钱海宁',
                timestamp: new Date(Date.now() - 43200000).toISOString() // 12小时前
            }
        );
        saveData();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新爱情计数器
    updateLoveCounter();
    setInterval(updateLoveCounter, 60000); // 每分钟更新一次
    
    // 添加示例数据
    addSampleData();
    
    // 渲染所有内容
    renderTimeline();
    renderMessages();
    renderPhotos();
    
    // 初始化事件处理
    handlePhotoUpload();
    handleModals();
    handleSmoothScroll();
    
    // 添加一些交互动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.timeline-item, .photo-item, .message-item, .memory-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 发送留言
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const messageInput = document.getElementById('message-input');
        if (document.activeElement === messageInput) {
            addMessage();
        }
    }
    
    // Esc 关闭模态框
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// 导出数据功能
function exportData() {
    const data = {
        memories: memories,
        messages: messages,
        photos: photos.map(photo => ({...photo, url: '数据太大，照片已省略'})), // 不导出照片数据
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-memories-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// 在控制台暴露一些调试功能
window.loveWebsite = {
    exportData,
    clearAllData: function() {
        if (confirm('确定要清除所有数据吗？这个操作无法撤销！')) {
            localStorage.removeItem('loveMemories');
            localStorage.removeItem('loveMessages');
            localStorage.removeItem('lovePhotos');
            location.reload();
        }
    },
    addSampleMemory: function() {
        const memory = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            title: '测试回忆 ' + Math.random().toString(36).substr(2, 5),
            description: '这是一个测试回忆，用于验证功能是否正常工作。'
        };
        memories.push(memory);
        saveData();
        renderTimeline();
    }
};

console.log('💕 欢迎来到我们的爱情记录网站！');
console.log('你可以使用 window.loveWebsite 来访问一些调试功能');
console.log('- exportData(): 导出所有数据');
console.log('- clearAllData(): 清除所有数据');
console.log('- addSampleMemory(): 添加测试回忆'); 