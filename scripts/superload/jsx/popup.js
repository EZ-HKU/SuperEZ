function findPDFLinks() {
    let fileLinks = [];
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        if (link.href &&
            link.href.includes('https://moodle.hku.hk/mod/resource/')) {
            let fileType = 'unknown';
            let iconSrc = '';

            try {
                // 获取父级的父级的父级的上一个sibling
                const parent = link.parentElement?.parentElement?.parentElement;
                const sibling = parent?.previousElementSibling;

                // 在sibling中查找img标签
                if (sibling) {
                    const img = sibling.querySelector('img');
                    if (img && img.src) {
                        iconSrc = img.src;
                        const match = iconSrc.match(/\/f\/([^?]+)/);
                        if (match && match[1]) {
                            fileType = match[1].toLowerCase();
                        }
                    }
                }
            } catch (error) {
                console.error('Error finding file type icon:', error);
            }
            fileLinks.push({
                text: link.textContent.trim() || 'Unnamed PDF',
                url: link.href,
                fileType: fileType,
            });
        }
    }
    return fileLinks;
}

superLoadPopup = () => {
    let fileLinks = findPDFLinks();

    // 创建表格容器
    const tableContainer = document.createElement('div');
    tableContainer.id = 'file-links-table';

    // 创建表格
    const table = document.createElement('table');
    table.style.cssText = `
    width: 100%;
    border-collapse: collapse;
`;

    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
        <input type="checkbox" id="select-all">
    </th>
    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;"></th>
`;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const fileTypes = ['pdf', 'document', 'spreadsheet', 'powerpoint', 'archive'];

    // 创建表体
    const tbody = document.createElement('tbody');
    fileLinks.forEach((file, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
            <input type="checkbox" class="file-checkbox" data-index="${index}">
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">
            <img src="${chrome.runtime.getURL(`icons/${fileTypes.includes(file.fileType) ? file.fileType : 'file'}.png`)}"
                 alt="${file.fileType}" 
                 style="width: 20px; height: 20px; vertical-align: middle;">
            <a href="${file.url}" target="_blank">${file.text}</a>
        </td>
    `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // 将表格添加到容器
    tableContainer.appendChild(table);

    // const selectAllCheckbox = document.getElementById('select-all');
    // const fileCheckboxes = document.querySelectorAll('.file-checkbox');
    // selectAllCheckbox.addEventListener('change', (e) => {
    //     fileCheckboxes.forEach(checkbox => {
    //         checkbox.checked = e.target.checked;
    //     });
    // });
    // fileCheckboxes.forEach(checkbox => {
    //     checkbox.addEventListener('change', () => {
    //         const allChecked = [...fileCheckboxes].every(checkbox => checkbox.checked);
    //         selectAllCheckbox.checked = allChecked;
    //     });
    // });

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'download selected';
    downloadButton.style.cssText = `
    margin-top: 10px;
    margin-left: 10px;
    padding: 5px 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
`;
    downloadButton.onclick = () => {
        const selectedCheckboxes = document.querySelectorAll('.file-checkbox:checked');
        selectedCheckboxes.forEach(checkbox => {
            const index = checkbox.getAttribute('data-index');
            const file = fileLinks[index];
            chrome.runtime.sendMessage({
                action: 'downloadFile',
                url: file.url,
                filename: file.text.replace(/[\\/?"*<>|:]|'/g, ''),
                address: document.querySelector('.h2').textContent, 
                conflictAction: 'uniquify', 
                saveAs: false
            });
        });
    };
    tableContainer.appendChild(downloadButton);
    return tableContainer;
};


window.popup.SuperLoadPopup = function () {
    return superLoadPopup();
};
