// ================= REVIEWS =================
const REVIEWS_KEY = 'luxewear_reviews';

function getProductReviews(productId) {
  try {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    return reviews[productId] || [];
  } catch(e) {
    return [];
  }
}

function saveReviews(productId, reviews) {
  try {
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    allReviews[productId] = reviews;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
  } catch(e) {
    console.error('Error saving reviews:', e);
  }
}

function setRating(rating) {
  selectedRating = rating;
  document.getElementById('selectedRating').value = rating;
  updateRatingStars(rating);
}

function updateRatingStars(rating) {
  const btns = document.querySelectorAll('#ratingInput .star-btn');
  btns.forEach((btn, idx) => {
    if (idx < rating) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function submitReview(event) {
  event.preventDefault();

  if (!currentDetailProductId) {
    showNotification('Error', 'Product not found', 'error');
    return;
  }

  if (selectedRating === 0) {
    showNotification('Error', 'Please select a rating', 'error');
    return;
  }

  const name = document.getElementById('reviewName').value.trim();
  const comment = document.getElementById('reviewComment').value.trim();

  if (!name || !comment) {
    showNotification('Error', 'Please fill in all fields', 'error');
    return;
  }

  const review = {
    id: 'review-' + Date.now(),
    name: name,
    rating: selectedRating,
    comment: comment,
    date: new Date().toISOString()
  };

  const reviews = getProductReviews(currentDetailProductId);
  reviews.push(review);
  saveReviews(currentDetailProductId, reviews);

  document.getElementById('reviewForm').reset();
  selectedRating = 0;
  document.getElementById('selectedRating').value = 0;
  updateRatingStars(0);

  renderProductReviews(currentDetailProductId);
  updateProductRatings(currentDetailProductId);

  showNotification('Success', 'Review submitted successfully!', 'success');
}

function renderProductReviews(productId) {
  const reviews = getProductReviews(productId);
  const container = document.getElementById('reviewsList');
  const noReviews = document.getElementById('noReviews');

  if (!container) return;

  container.innerHTML = '';

  if (reviews.length === 0) {
    noReviews.style.display = 'block';
    return;
  }

  noReviews.style.display = 'none';

  reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(review => {
    const div = document.createElement('div');
    div.className = 'review-item';

    const date = new Date(review.date);
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += i < review.rating ? '<span class="material-symbols-outlined">star</span>' : '<span class="material-symbols-outlined">star_outline</span>';
    }

    div.innerHTML = `
      <div class="review-header">
        <div>
          <span class="review-name">${review.name}</span>
          <span class="review-date">${dateStr}</span>
        </div>
        <button class="review-delete-btn" onclick="deleteReview('${productId}', '${review.id}')" title="Delete review" aria-label="Delete review">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
      <div class="review-stars">
        ${starsHtml}
      </div>
      <div class="review-text">${review.comment}</div>
    `;

    container.appendChild(div);
  });
}

function deleteReview(productId, reviewId) {
  const reviews = getProductReviews(productId);
  const filteredReviews = reviews.filter(r => r.id !== reviewId);
  saveReviews(productId, filteredReviews);
  renderProductReviews(productId);
  updateProductRatings(productId);
  showNotification('Success', 'Review deleted successfully', 'success');
}

function updateProductRatings(productId) {
  const reviews = getProductReviews(productId);

  if (reviews.length === 0) {
    document.getElementById('detailRating').innerHTML = `
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
      <span class="material-symbols-outlined">star_outline</span>
    `;
    document.getElementById('detailReviewCount').textContent = '(0 reviews)';
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedRating = Math.round(avgRating);

  let starsHtml = '';
  for (let i = 0; i < 5; i++) {
    starsHtml += i < roundedRating ? '<span class="material-symbols-outlined">star</span>' : '<span class="material-symbols-outlined">star_outline</span>';
  }

  document.getElementById('detailRating').innerHTML = starsHtml;
  document.getElementById('detailReviewCount').textContent = `(${reviews.length} reviews)`;
}
