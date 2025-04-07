function findPDFLinks() {
    let fileLinks = [];
    let links = document.getElementsByTagName('a');
    // filter links
    links = Array.from(links).filter(link => link.href && link.href.includes('https://moodle.hku.hk/mod/resource/') && link.classList.contains('aalink'));
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

window.popup.SuperLoadPopup = async function () {
    let fileLinks = findPDFLinks();
    let posibleFileTypes = ['pdf', 'file', 'powerpoint', 'spreadsheet', 'archive', 'document', 'video', 'image'];
    let downloadedFileIDs = (await window.utils.getStorage('downloadedFileIDs')).downloadedFileIDs || [];
    console.log(downloadedFileIDs);
    return (
        window.elements.Div({
            id: "ez-superload-file-links",
            style: {
                overflow: "auto",
                maxHeight: "75vh",
            }
        }, [
            window.elements.Div({
                id: "ez-superload-file-links-table",
                style: {}
            }, [
                window.elements.Table({
                    style: {
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: "77px",
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
                            ]),
                            window.elements.Th({
                                style: {
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                    textAlign: "center",
                                },
                            }, [
                                window.elements.Button({
                                    textContent: "Status",
                                    title: "Click to select all undownloaded files",
                                    style: {
                                        backgroundColor: "#fff",
                                        border: "1.5px solid #ddd",
                                        cursor: "pointer",
                                        margin: "0",
                                        borderRadius: "5px",
                                        fontWeight: "bold",
                                        padding: "0 8px",
                                    },
                                    onClick: () => {
                                        fileLinks
                                        .filter(file => !downloadedFileIDs.includes(file.url.split("id=")[1]))
                                        .forEach(file => {
                                            let checkbox = document.getElementById(`ez-superload-file-checkbox-${fileLinks.indexOf(file)}`);
                                            checkbox.checked = true;
                                        });
                                    }
                                })
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
                                        src: chrome.runtime.getURL(posibleFileTypes.includes(file.fileType) ? `icons/${file.fileType}.png` : 'icons/file.png'),
                                        alt: file.fileType,
                                        style: {
                                            width: "20px",
                                            height: "20px",
                                            verticalAlign: "middle",
                                        },
                                    }),
                                    window.elements.Text(file.text, {
                                        style: {
                                            color: "#00b48d",
                                            cursor: "pointer",
                                            marginLeft: "5px",
                                        },
                                        onClick: () => {
                                            let checkbox = document.getElementById(`ez-superload-file-checkbox-${index}`);
                                            checkbox.checked = !checkbox.checked;
                                        }
                                    })
                                ]),
                                window.elements.Td({
                                    style: {
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        textAlign: "center",
                                    },
                                }, [
                                    downloadedFileIDs.includes(file.url.split("id=")[1]) ?
                                        window.elements.Image({
                                            src: chrome.runtime.getURL('icons/downloaded.png'),
                                            alt: file.fileType,
                                            style: {
                                                width: "20px",
                                                height: "20px",
                                                verticalAlign: "middle",
                                            },
                                        }) : window.elements.Text("")
                                ]
                                )
                            ]);
                        })
                    ),
                ]),
            ]),
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
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    zIndex: "9999",
                },
                onClick: () => {
                    let fileIDs = [];
                    let downloadFiles = [];
                    let address = document.querySelector('.h2').textContent;
                    const selectedCheckboxes = document.querySelectorAll('.ez-superload-file-checkbox:checked');
                    selectedCheckboxes.forEach(checkbox => {
                        const index = checkbox.id.split('-').pop();
                        const file = fileLinks[index];
                        downloadFiles.push({ url: file.url, filename: file.text.replace(/[\\/?"*<>|:]|'/g, ''), address: address });
                        fileIDs.push(file.url.split("id=")[1]);
                    });
                    chrome.runtime.sendMessage({
                        action: 'downloadFiles',
                        downloadFiles: downloadFiles,
                        conflictAction: 'uniquify',
                        saveAs: false
                    });
                    downloadedFileIDs = [...new Set([...downloadedFileIDs, ...fileIDs])];
                    chrome.storage.sync.set({ downloadedFileIDs: downloadedFileIDs });
                    window.utils.closePopup();
                }
            })

        ])
    );
};
