function findPDFLinks() {
    let fileLinks = [];
    let links = document.getElementsByTagName('a');
    // filter links
    links = Array.from(links).filter(link => link.href && link.href.includes('https://moodle.hku.hk/mod/resource/') && link.classList.contains('aalink'));
    console.log(links);
    for (let link of links) {
        if (link.href &&
            link.href.includes('https://moodle.hku.hk/mod/resource/')) {
            let fileType = 'unknown';
            let iconSrc = '';

            try {
                const parent = link.parentElement?.parentElement?.parentElement;
                const sibling = parent?.previousElementSibling;

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
                text: link.textContent.trim().slice(-5) === ' File' ? link.textContent.trim().slice(0, -5) : link.textContent.trim(),
                url: link.href,
                fileType: fileType,
            });
        }
    }
    console.log(fileLinks);
    return fileLinks;
}

window.popup.SuperLoadPopup = function () {
    let fileLinks = findPDFLinks();
    return (
        window.elements.Div({
            id: "ez-superload-file-links-table",
        }, [
            window.elements.Table({
                style: {
                    width: "100%",
                    borderCollapse: "collapse",
                },
            }, [
                window.elements.Thead({
                    style: {
                        backgroundColor: "#f2f2f2",
                    },
                }, [
                    window.elements.Tr({}, [
                        window.elements.Th({
                            style: {
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "center",
                            },
                        }, [
                            window.elements.Input({
                                type: "checkbox",
                                id: "ez-superload-select-all",
                                onClick: (e) => {
                                    const checkboxes = document.querySelectorAll('.ez-superload-file-checkbox');
                                    checkboxes.forEach(checkbox => {
                                        checkbox.checked = e.target.checked;
                                    });
                                }
                            })
                        ]),
                        window.elements.Th({
                            style: {
                                border: "1px solid #ddd",
                                padding: "8px",
                                textAlign: "left",
                            },
                        }, [
                            window.elements.Text("File")
                        ])
                    ]),
                ]),
                window.elements.Tbody({}, 
                    fileLinks.map((file, index) => {
                        return window.elements.Tr({}, [
                            window.elements.Td({
                                style: {
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "center",
                                },
                            }, [
                                window.elements.Input({
                                    type: "checkbox",
                                    className: "ez-superload-file-checkbox",
                                    id: `ez-superload-file-checkbox-${index}`,
                                    onClick: (e) => {
                                        const selectAllCheckbox = document.getElementById('ez-superload-select-all');
                                        const checkboxes = document.querySelectorAll('.ez-superload-file-checkbox');
                                        selectAllCheckbox.checked = [...checkboxes].every(checkbox => checkbox.checked);
                                    }
                                })
                            ]),
                            window.elements.Td({
                                style: {
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                },
                            }, [
                                window.elements.Image({
                                    src: chrome.runtime.getURL(`icons/${file.fileType}.png`),
                                    alt: file.fileType,
                                    style: {
                                        width: "20px",
                                        height: "20px",
                                        verticalAlign: "middle",
                                    },
                                }),
                                window.elements.A({
                                    href: file.url,
                                    target: "_blank",
                                    textContent: file.text,
                                })
                            ])
                        ]);
                    })
                ),
                window.elements.Tr({}, [
                    window.elements.Td({
                        colSpan: 2,
                        style: {
                            textAlign: "right",
                        },
                    }, [
                        window.elements.Button({
                            id: "ez-superload-download-selected",
                            textContent: "Download Selected",
                            style: {
                                marginTop: "10px",
                                marginLeft: "10px",
                                padding: "5px 10px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                            },
                            onClick: () => {
                                const selectedCheckboxes = document.querySelectorAll('.ez-superload-file-checkbox:checked');
                                selectedCheckboxes.forEach(checkbox => {
                                    const index = checkbox.id.split('-').pop();
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
                            }
                        })
                    ])
                ])
            ])
        ])
    );
};
