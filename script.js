// Utility function to create elements with classes and inner text
function createElement(tag, classes, text) {
    const element = document.createElement(tag);
    if (classes) element.className = classes;
    if (text) element.innerText = text;
    return element;
}

// Function to handle image interactions
function addImageInteractions(img, isPostImage) {
    img.style.cursor = 'pointer';
    img.style.maxWidth = isPostImage ? '100%' : '100px';

    img.onclick = () => {
        const modal = createElement('div', 'modal');
        const modalContent = createElement('div', 'modal-content');
        const fullImage = createElement('img', 'full-image');
        fullImage.src = img.src;
        modalContent.appendChild(fullImage);
s
        const saveButton = createElement('button', 'save-button', 'Save');
        saveButton.onclick = (event) => {
            event.stopPropagation();
            saveImage(fullImage.src);
        };
        modalContent.appendChild(saveButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.onclick = () => {
            document.body.removeChild(modal);
        };
    };
}

//Here's a JavaScript snippet to detect clicks outside the comment section and close it:

document.addEventListener('DOMContentLoaded', function() {
    const commentSections = document.querySelectorAll('.comment-section');

    document.addEventListener('click', function(event) {
        let isClickInside = false;

        commentSections.forEach(section => {
            if (section.contains(event.target) || event.target.classList.contains('comment-button')) {
                isClickInside = true;
            }
        });

        if (!isClickInside) {
            commentSections.forEach(section => {
                section.style.display = 'none';
            });
        }
    });
});



// Toggle comment section visibility
const commentButtons = document.querySelectorAll('.comment-button');
commentButtons.forEach(button => {
    button.addEventListener('click', function() {
        const post = this.closest('.feed');
        const commentSection = post.querySelector('.comment-section');
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    });
});



// Function to save the image
function saveImage(src) {
    const a = document.createElement('a');
    a.href = src;
    a.download = 'image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to toggle the comment section visibility
function toggleComments(postDiv) {
    let commentSection = postDiv.querySelector('.comment-section');
    if (!commentSection) {
        commentSection = createElement('div', 'comment-section');
        postDiv.appendChild(commentSection);
        addCommentForm(commentSection);
    } else {
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Function to add a comment form
function addCommentForm(commentSection) {
    const commentForm = createElement('form', 'comment-form');
    const commentTextarea = createElement('textarea', '', '');
    const commentImageInput = document.createElement('input');
    commentImageInput.type = 'file';
    commentImageInput.accept = 'image/*';
    const commentButton = createElement('button', '', 'Comment');
    commentButton.type = 'button';
    commentButton.onclick = () => submitComment(commentSection, commentTextarea, commentImageInput, commentForm);

    commentForm.append(commentTextarea, commentImageInput, commentButton);
    commentSection.appendChild(commentForm);
    commentForm.style.display = 'block';
}

// Function to handle comment submission
function submitComment(commentSection, commentTextarea, commentImageInput, commentForm) {
    const commentDiv = createElement('div', 'comment');
    const commentText = commentTextarea.value;
    const commentImage = commentImageInput.files[0];

    if (commentText) {
        const textPara = createElement('p', '', commentText);
        commentDiv.appendChild(textPara);
    }

    if (commentImage) {
        const img = createElement('img', 'comment-image');
        img.src = URL.createObjectURL(commentImage);
        img.alt = 'Comment Image';
        addImageInteractions(img, false);
        commentDiv.appendChild(img);
    }

    const replyIcon = createElement('span', 'icon uil uil-reply');
    replyIcon.onclick = () => addReplyForm(commentDiv);

    const likeIcon = createElement('span', 'icon uil uil-thumbs-up');

    commentDiv.append(replyIcon, likeIcon);

    commentSection.appendChild(commentDiv);

    commentTextarea.value = '';
    commentImageInput.value = '';
    commentForm.style.display = 'none';
}

// Function to add a reply form
function addReplyForm(commentDiv) {
    const existingForm = commentDiv.querySelector('.reply-form');
    if (!existingForm) {
        const replyForm = createElement('form', 'reply-form');
        const replyTextarea = createElement('textarea', '', '');
        const replyImageInput = document.createElement('input');
        replyImageInput.type = 'file';
        replyImageInput.accept = 'image/*';
        const replyButton = createElement('button', '', 'Reply');
        replyButton.type = 'button';
        replyButton.onclick = () => submitReply(commentDiv, replyTextarea, replyImageInput, replyForm);

        replyForm.append(replyTextarea, replyImageInput, replyButton);
        commentDiv.appendChild(replyForm);
        replyForm.style.display = 'block';
    }
}

// Function to handle reply submission
function submitReply(commentDiv, replyTextarea, replyImageInput, replyForm) {
    const replyDiv = createElement('div', 'reply');
    const replyText = replyTextarea.value;
    const replyImage = replyImageInput.files[0];

    if (replyText) {
        const textPara = createElement('p', '', replyText);
        replyDiv.appendChild(textPara);
    }

    if (replyImage) {
        const img = createElement('img', 'reply-image');
        img.src = URL.createObjectURL(replyImage);
        img.alt = 'Reply Image';
        addImageInteractions(img, false);
        replyDiv.appendChild(img);
    }

    const replyIcon = createElement('span', 'icon uil uil-reply');
    replyIcon.onclick = () => addReplyForm(replyDiv);

    const likeIcon = createElement('span', 'icon uil uil-thumbs-up');

    replyDiv.append(replyIcon, likeIcon);

    commentDiv.appendChild(replyDiv);

    replyTextarea.value = '';
    replyImageInput.value = '';
    replyForm.style.display = 'none';
}

// Function to create a new post element
function createPost(textContent, imageFile) {
    const feed = document.createElement('div');
    feed.classList.add('feed');
    let innerHTML = `
        <div class="head">
            <div class="user">
                <div class="profile-picture">
                    <img src="images/profile-1.jpg">
                </div>
                <div class="info">
                    <h3>Diane</h3>
                    <small>Just now</small>
                </div>
            </div>
            <span class="edit">
                <i class="uil uil-ellipsis-h"></i>
            </span>
        </div>
    `;

    // Adding post text
    innerHTML += `
        <div class="caption">
            <p>${textContent}</p>
        </div>
    `;

    // Adding post image if available
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            innerHTML += `
                <div class="photo">
                    <img src="${event.target.result}">
                </div>
            `;
            innerHTML += `<div class="action-buttons">
                            <span class="icon uil uil-heart"></span>
                            <span class="icon uil uil-comment-dots" onclick="toggleComments(this.closest('.feed'))"></span>
                            <span class="icon uil uil-share-alt"></span>
                          </div>`;
            feed.innerHTML = innerHTML;
            document.querySelector('.feeds').prepend(feed);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // If no image, directly add action buttons
        innerHTML += `<div class="action-buttons">
                        <span class="icon uil uil-heart"></span>
                        <span class="icon uil uil-comment-dots" onclick="toggleComments(this.closest('.feed'))"></span>
                        <span class="icon uil uil-share-alt"></span>
                      </div>`;
        feed.innerHTML = innerHTML;
        document.querySelector('.feeds').prepend(feed);
    }
}

// Function to toggle the comment section visibility
function toggleComments(postDiv) {
    let commentSection = postDiv.querySelector('.comment-section');
    if (!commentSection) {
        commentSection = createElement('div', 'comment-section');
        postDiv.appendChild(commentSection);
        addCommentForm(commentSection);
    } else {
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Function to add a comment form
function addCommentForm(commentSection) {
    const commentForm = createElement('form', 'comment-form');
    const commentTextarea = createElement('textarea', '', '');
    const commentImageInput = document.createElement('input');
    commentImageInput.type = 'file';
    commentImageInput.accept = 'image/*';
    const commentButton = createElement('button', '', 'Comment');
    commentButton.type = 'button';
    commentButton.onclick = () => submitComment(commentSection, commentTextarea, commentImageInput, commentForm);

    commentForm.append(commentTextarea, commentImageInput, commentButton);
    commentSection.appendChild(commentForm);
    commentForm.style.display = 'block';
}

// Function to handle comment submission
function submitComment(commentSection, commentTextarea, commentImageInput, commentForm) {
    const commentDiv = createElement('div', 'comment');
    const commentText = commentTextarea.value;
    const commentImage = commentImageInput.files[0];

    if (commentText) {
        const textPara = createElement('p', '', commentText);
        commentDiv.appendChild(textPara);
    }

    if (commentImage) {
        const img = createElement('img', 'comment-image');
        img.src = URL.createObjectURL(commentImage);
        img.alt = 'Comment Image';
        addImageInteractions(img, false);
        commentDiv.appendChild(img);
    }

    const replyButton = createElement('button', '', 'Reply');
    replyButton.onclick = () => addReplyForm(commentDiv);

    const likeButton = createElement('button', '', 'Like');
    likeButton.onclick = () => likeComment(commentDiv);

    commentDiv.append(replyButton, likeButton);

    commentSection.appendChild(commentDiv);

    commentTextarea.value = '';
    commentImageInput.value = '';
}

// Function to add a reply form
function addReplyForm(commentDiv) {
    const replyForm = createElement('form', 'reply-form');
    const replyTextarea = createElement('textarea', '', '');
    const replyImageInput = document.createElement('input');
    replyImageInput.type = 'file';
    replyImageInput.accept = 'image/*';
    const replyButton = createElement('button', '', 'Reply');
    replyButton.type = 'button';
    replyButton.onclick = () => submitReply(commentDiv, replyTextarea, replyImageInput, replyForm);

    replyForm.append(replyTextarea, replyImageInput, replyButton);
    commentDiv.appendChild(replyForm);
    replyForm.style.display = 'block';
}

// Function to handle reply submission
function submitReply(commentDiv, replyTextarea, replyImageInput, replyForm) {
    const replyDiv = createElement('div', 'reply');
    const replyText = replyTextarea.value;
    const replyImage = replyImageInput.files[0];

    if (replyText) {
        const textPara = createElement('p', '', replyText);
        replyDiv.appendChild(textPara);
    }

    if (replyImage) {
        const img = createElement('img', 'reply-image');
        img.src = URL.createObjectURL(replyImage);
        img.alt = 'Reply Image';
        addImageInteractions(img, false);
        replyDiv.appendChild(img);
    }

    const replyButton = createElement('button', '', 'Reply');
    replyButton.onclick = () => addReplyForm(replyDiv);

    const likeButton = createElement('button', '', 'Like');
    likeButton.onclick = () => likeComment(replyDiv);

    replyDiv.append(replyButton, likeButton);

    commentDiv.appendChild(replyDiv);

    replyTextarea.value = '';
    replyImageInput.value = '';
}

// Function to handle liking a comment
function likeComment(comment) {
    const likeButton = comment.querySelector('button:contains("Like")');
    likeButton.innerText = 'Liked';
    likeButton.disabled = true;
}

document.addEventListener('DOMContentLoaded', function() {
    const postButton = document.querySelector('.text-post-btn');
    const postInput = document.querySelector('.create-post input[type="text"]');
    const imageInput = document.getElementById('image');
    const feedsContainer = document.querySelector('.feeds');

    // Event listener for the post button
    postButton.addEventListener('click', function(event) {
        event.preventDefault();
        const textContent = postInput.value.trim();
        const imageFile = imageInput.files[0];

        if (textContent || imageFile) {
            createPost(textContent, imageFile);
            postInput.value = '';
            imageInput.value = '';
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const postButton = document.querySelector('.text-post-btn');
    const postInput = document.querySelector('.create-post input[type="text"]');
    const imageInput = document.getElementById('image');
    const feedsContainer = document.querySelector('.feeds');

    // Event listener for the post button
    postButton.addEventListener('click', function(event) {
        event.preventDefault();
        const textContent = postInput.value.trim();
        const imageFile = imageInput.files[0];

        if (textContent || imageFile) {
            createPost(textContent, imageFile);
            postInput.value = '';
            imageInput.value = '';
        }
    });
});