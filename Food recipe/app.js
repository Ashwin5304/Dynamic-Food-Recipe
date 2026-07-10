/**
 * FlavorCraft — Food Recipe Web Application Controller
 * Handles SPA routing, mock local database initialization, user authentication,
 * recipe CRUD operations, search indexing, and real-time UI rendering.
 */

// ============================================================================
// MOCK DATABASE & INITIAL SEEDING
// ============================================================================

const SEED_USERS = [
  {
    id: "user-admin",
    name: "Admin Moderator",
    email: "admin@flavorcraft.com",
    password: "admin123", // For production, use password hashing. This is a mock DB.
    role: "admin"
  },
  {
    id: "user-client-1",
    name: "Chef Gordon",
    email: "chef@flavorcraft.com",
    password: "chef123",
    role: "client"
  },
  {
    id: "user-client-2",
    name: "Jamie Oliver",
    email: "chef2@flavorcraft.com",
    password: "chef123",
    role: "client"
  }
];

const SEED_RECIPES = [
  {
    id: "recipe-1",
    title: "Classic Margherita Pizza",
    description: "A simple yet delicious classic Italian pizza made with fresh San Marzano tomatoes, creamy mozzarella cheese, fresh basil leaves, and a drizzle of premium olive oil on a charred, bubbly crust.",
    category: "dinner",
    prepTime: 20,
    cookTime: 12,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=600",
    ingredients: [
      "1 ball of pre-made Neapolitan pizza dough",
      "1/2 cup canned crushed San Marzano tomatoes",
      "4 oz fresh mozzarella cheese, sliced or torn",
      "6-8 fresh basil leaves",
      "1 tbsp extra-virgin olive oil",
      "A pinch of kosher salt"
    ],
    steps: [
      "Preheat your oven to its highest setting (usually 500°F/260°C) with a pizza stone inside.",
      "Stretch the pizza dough gently on a floured surface to about a 12-inch circle.",
      "Spread the crushed tomatoes evenly across the dough, leaving a 1-inch border for the crust.",
      "Distribute the fresh mozzarella cheese slices and a few fresh basil leaves over the sauce.",
      "Carefully transfer the pizza onto the preheated stone. Bake for 10-12 minutes until the crust is golden and charred in spots.",
      "Remove from the oven, garnish with the remaining fresh basil, drizzle with olive oil, and serve immediately."
    ],
    authorId: "user-client-1",
    authorName: "Chef Gordon",
    createdDate: Date.now() - 1000 * 60 * 60 * 24 * 5 // 5 days ago
  },
  {
    id: "recipe-2",
    title: "Creamy Garlic Butter Shrimp Pasta",
    description: "Rich, velvety pasta tossed with plump garlic-infused shrimp, heavy cream, freshly grated Parmesan, and a touch of parsley. Ready in under 30 minutes!",
    category: "lunch",
    prepTime: 10,
    cookTime: 15,
    servings: 3,
    imageUrl: "https://images.unsplash.com/photo-1563379971899-660589a01cc3?auto=format&fit=crop&q=80&w=600",
    ingredients: [
      "8 oz linguine or fettuccine pasta",
      "1 lb large shrimp, peeled and deveined",
      "4 tbsp unsalted butter",
      "4 cloves garlic, minced",
      "1/2 cup heavy cream",
      "1/2 cup freshly grated Parmesan cheese",
      "1/4 cup chopped fresh parsley",
      "Salt and freshly cracked black pepper to taste"
    ],
    steps: [
      "Boil pasta in a large pot of salted water according to package instructions until al dente. Reserve 1/2 cup of pasta water, then drain.",
      "Meanwhile, melt 2 tablespoons of butter in a large skillet over medium-high heat. Season shrimp with salt and pepper.",
      "Add shrimp to the skillet and cook for 2 minutes on each side until pink. Transfer shrimp to a plate.",
      "Melt the remaining butter in the same skillet. Add garlic and cook for 1 minute until fragrant.",
      "Pour in the heavy cream and bring to a simmer. Lower heat and stir in the Parmesan cheese until smooth.",
      "Add the drained pasta, cooked shrimp, and chopped parsley to the sauce. Toss gently, adding a splash of reserved pasta water if needed to loosen the sauce. Serve hot."
    ],
    authorId: "user-client-2",
    authorName: "Jamie Oliver",
    createdDate: Date.now() - 1000 * 60 * 60 * 24 * 2 // 2 days ago
  },
  {
    id: "recipe-3",
    title: "Decadent Chocolate Lava Cakes",
    description: "Indulgent warm chocolate cakes with a rich, molten chocolate center that flows out when cut. A showstopping dessert that is surprisingly simple to make.",
    category: "dessert",
    prepTime: 15,
    cookTime: 13,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600",
    ingredients: [
      "4 oz high-quality semi-sweet baking chocolate, chopped",
      "1/2 cup unsalted butter",
      "2 whole large eggs plus 2 egg yolks",
      "1/4 cup granulated sugar",
      "1/8 tsp salt",
      "2 tbsp all-purpose flour",
      "Powdered sugar and fresh berries for serving"
    ],
    steps: [
      "Preheat your oven to 425°F (218°C). Generously butter four 6-ounce ramekins and dust with cocoa powder.",
      "Microwave the chopped chocolate and butter in a heat-safe bowl in 30-second bursts, stirring until fully melted and smooth.",
      "In a separate medium bowl, whisk the whole eggs, egg yolks, sugar, and salt together until light and thick.",
      "Gently fold the melted chocolate mixture and the flour into the egg mixture until just combined.",
      "Divide the batter evenly among the prepared ramekins. Place ramekins on a baking sheet.",
      "Bake for 12-14 minutes until the edges are firm but the centers still jiggle slightly. Let cool for 1 minute.",
      "Place a dessert plate over the top of a ramekin, carefully invert it, and lift the ramekin. Garnish with powdered sugar and berries."
    ],
    authorId: "user-client-1",
    authorName: "Gordon Ramsay",
    createdDate: Date.now() - 1000 * 60 * 60 * 4 // 4 hours ago
  }
];

// Initialize Database in LocalStorage
function initDatabase() {
  if (!localStorage.getItem("fc_users")) {
    localStorage.setItem("fc_users", JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem("fc_recipes")) {
    localStorage.setItem("fc_recipes", JSON.stringify(SEED_RECIPES));
  }
}

// Fetch helper methods
function getUsersFromDB() {
  return JSON.parse(localStorage.getItem("fc_users")) || [];
}

function saveUsersToDB(users) {
  localStorage.setItem("fc_users", JSON.stringify(users));
}

function getRecipesFromDB() {
  return JSON.parse(localStorage.getItem("fc_recipes")) || [];
}

function saveRecipesToDB(recipes) {
  localStorage.setItem("fc_recipes", JSON.stringify(recipes));
}

// ============================================================================
// SYSTEM STATE MANAGEMENT
// ============================================================================

let currentUser = null;
let currentActiveView = "view-auth";
let previousView = "view-auth";

function loadSession() {
  const sessionUser = sessionStorage.getItem("fc_current_user");
  if (sessionUser) {
    currentUser = JSON.parse(sessionUser);
    updateAuthUI();
  }
}

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem("fc_current_user", JSON.stringify(user));
  updateAuthUI();
}

function destroySession() {
  currentUser = null;
  sessionStorage.removeItem("fc_current_user");
  updateAuthUI();
  showToast("Logged out successfully.", "info");
  switchView("view-auth");
}

// ============================================================================
// TOAST NOTIFICATION UTILITY
// ============================================================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconClass = "fa-circle-check";
  if (type === "danger") iconClass = "fa-triangle-exclamation";
  if (type === "info") iconClass = "fa-circle-info";
  
  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Slide out and remove toast after 4s
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease-out reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================================
// SPA VIEWS ROUTER
// ============================================================================

function switchView(viewId) {
  // Track history for details and form views
  if (viewId !== "view-recipe-details" && viewId !== "view-recipe-form" && viewId !== currentActiveView) {
    previousView = currentActiveView;
    currentActiveView = viewId;
  }

  const views = document.querySelectorAll(".app-view");
  views.forEach(view => {
    view.classList.remove("active");
  });

  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.add("active");
  }

  // Update header search visibility (only show on Discover/Browse view)
  const searchContainer = document.getElementById("header-search-container");
  if (viewId === "view-browse") {
    searchContainer.style.display = "block";
  } else {
    searchContainer.style.display = "none";
  }

  // Active state in Nav links
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.classList.remove("active");
  });

  if (viewId === "view-browse") {
    document.getElementById("link-browse").classList.add("active");
  } else if (viewId === "view-admin") {
    document.getElementById("link-admin").classList.add("active");
  }

  // View specific setups
  if (viewId === "view-browse") {
    renderRecipes();
  } else if (viewId === "view-admin") {
    renderAdminDashboard();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update UI elements based on authentication status
function updateAuthUI() {
  const loginTrigger = document.getElementById("btn-login-trigger");
  const userMenu = document.getElementById("user-profile-menu");
  const userDisplayName = document.getElementById("user-display-name");
  const userRoleBadge = document.getElementById("user-role-badge");
  
  const linkMyRecipes = document.getElementById("link-my-recipes");
  const linkAddRecipe = document.getElementById("link-add-recipe");
  const linkAdmin = document.getElementById("link-admin");

  if (currentUser) {
    // Logged in
    loginTrigger.classList.add("hidden");
    userMenu.classList.remove("hidden");
    userDisplayName.textContent = currentUser.name;
    userRoleBadge.textContent = currentUser.role;
    userRoleBadge.className = `badge ${currentUser.role}-badge`;

    if (currentUser.role === "admin") {
      linkMyRecipes.classList.add("hidden-nav-item");
      linkAddRecipe.classList.add("hidden-nav-item");
      linkAdmin.classList.remove("hidden-nav-item");
    } else {
      // Client
      linkMyRecipes.classList.remove("hidden-nav-item");
      linkAddRecipe.classList.remove("hidden-nav-item");
      linkAdmin.classList.add("hidden-nav-item");
    }
  } else {
    // Logged out
    loginTrigger.classList.remove("hidden");
    userMenu.classList.add("hidden");
    
    linkMyRecipes.classList.add("hidden-nav-item");
    linkAddRecipe.classList.add("hidden-nav-item");
    linkAdmin.classList.add("hidden-nav-item");
  }
}

// ============================================================================
// RECIPE BROWSE AND DISCOVER VIEW LOGIC
// ============================================================================

let activeCategory = "all";
let searchFilterQuery = "";

function renderRecipes() {
  const grid = document.getElementById("recipes-grid");
  const emptyState = document.getElementById("browse-empty-state");
  grid.innerHTML = "";

  let recipes = getRecipesFromDB();

  // 1. Filter by Category Tab
  if (activeCategory !== "all") {
    recipes = recipes.filter(r => r.category === activeCategory);
  }

  // 2. Filter by Search Query
  if (searchFilterQuery.trim() !== "") {
    const q = searchFilterQuery.toLowerCase();
    recipes = recipes.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }

  // 3. Sorting
  const sortBy = document.getElementById("sort-select").value;
  if (sortBy === "newest") {
    recipes.sort((a, b) => b.createdDate - a.createdDate);
  } else if (sortBy === "oldest") {
    recipes.sort((a, b) => a.createdDate - b.createdDate);
  } else if (sortBy === "time-low") {
    recipes.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
  }

  // Check empty state
  if (recipes.length === 0) {
    grid.style.display = "none";
    emptyState.classList.remove("hidden");
    return;
  } else {
    grid.style.display = "grid";
    emptyState.classList.add("hidden");
  }

  // Render cards
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    
    const isOwner = currentUser && recipe.authorId === currentUser.id;
    const isAdmin = currentUser && currentUser.role === "admin";
    
    // Action buttons inside footer depending on user authorization
    let actionsHtml = "";
    if (isOwner) {
      actionsHtml = `
        <button class="btn-icon edit-btn" onclick="openRecipeEditor('${recipe.id}', event)" title="Modify Recipe">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn-icon delete-btn" onclick="deleteRecipe('${recipe.id}', event)" title="Delete Recipe">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
    } else if (isAdmin) {
      actionsHtml = `
        <button class="btn-icon delete-btn" onclick="deleteRecipe('${recipe.id}', event)" title="Moderate: Delete">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
    }

    const defaultImg = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600";
    const finalImg = recipe.imageUrl && recipe.imageUrl.trim() !== "" ? recipe.imageUrl : defaultImg;

    card.innerHTML = `
      <div class="recipe-image-wrapper">
        <span class="recipe-badge">${recipe.category}</span>
        <img src="${finalImg}" class="recipe-card-img" alt="${recipe.title}" onerror="this.src='${defaultImg}'">
      </div>
      <div class="recipe-card-content">
        <div class="recipe-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${recipe.prepTime + recipe.cookTime} mins</span>
          <span><i class="fa-solid fa-user-pen"></i> By ${recipe.authorName}</span>
        </div>
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <div class="recipe-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="showRecipeDetails('${recipe.id}')">View Recipe</button>
          <div class="recipe-card-actions">
            ${actionsHtml}
          </div>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// Filter current user's recipes
function filterMyRecipes() {
  activeCategory = "all";
  const catTabs = document.querySelectorAll(".category-tab");
  catTabs.forEach(t => t.classList.remove("active"));
  document.querySelector('[data-category="all"]').classList.add("active");

  const grid = document.getElementById("recipes-grid");
  const emptyState = document.getElementById("browse-empty-state");
  grid.innerHTML = "";

  if (!currentUser) return;

  let recipes = getRecipesFromDB().filter(r => r.authorId === currentUser.id);

  if (recipes.length === 0) {
    grid.style.display = "none";
    emptyState.classList.remove("hidden");
    emptyState.querySelector("h3").textContent = "You Haven't Shared Any Recipes Yet";
    emptyState.querySelector("p").textContent = "Inspire the community by sharing your first mouthwatering dish!";
    return;
  } else {
    grid.style.display = "grid";
    emptyState.classList.add("hidden");
  }

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    const defaultImg = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600";
    const finalImg = recipe.imageUrl && recipe.imageUrl.trim() !== "" ? recipe.imageUrl : defaultImg;

    card.innerHTML = `
      <div class="recipe-image-wrapper">
        <span class="recipe-badge">${recipe.category}</span>
        <img src="${finalImg}" class="recipe-card-img" alt="${recipe.title}" onerror="this.src='${defaultImg}'">
      </div>
      <div class="recipe-card-content">
        <div class="recipe-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${recipe.prepTime + recipe.cookTime} mins</span>
          <span><i class="fa-solid fa-user-pen"></i> By Me</span>
        </div>
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <div class="recipe-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="showRecipeDetails('${recipe.id}')">View Recipe</button>
          <div class="recipe-card-actions">
            <button class="btn-icon edit-btn" onclick="openRecipeEditor('${recipe.id}', event)" title="Modify Recipe">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon delete-btn" onclick="deleteRecipe('${recipe.id}', event)" title="Delete Recipe">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ============================================================================
// RECIPE DETAILS VIEW
// ============================================================================

function showRecipeDetails(id) {
  const recipe = getRecipesFromDB().find(r => r.id === id);
  if (!recipe) {
    showToast("Recipe not found.", "danger");
    return;
  }

  const actionContainer = document.getElementById("details-author-actions");
  actionContainer.innerHTML = "";

  const isOwner = currentUser && recipe.authorId === currentUser.id;
  const isAdmin = currentUser && currentUser.role === "admin";

  if (isOwner) {
    actionContainer.innerHTML = `
      <button class="btn btn-secondary btn-sm" onclick="openRecipeEditor('${recipe.id}')">
        <i class="fa-solid fa-pen-to-square"></i> Edit
      </button>
      <button class="btn btn-danger btn-sm" onclick="deleteRecipe('${recipe.id}')">
        <i class="fa-solid fa-trash-can"></i> Delete
      </button>
    `;
  } else if (isAdmin) {
    actionContainer.innerHTML = `
      <button class="btn btn-danger btn-sm" onclick="deleteRecipe('${recipe.id}')">
        <i class="fa-solid fa-trash-can"></i> Moderate (Delete)
      </button>
    `;
  }

  const content = document.getElementById("recipe-details-content");
  const totalTime = recipe.prepTime + recipe.cookTime;
  const defaultImg = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600";
  const finalImg = recipe.imageUrl && recipe.imageUrl.trim() !== "" ? recipe.imageUrl : defaultImg;

  // Build Ingredients List HTML with interactive checklists
  const ingredientsHtml = recipe.ingredients.map((ing, i) => `
    <li>
      <label>
        <input type="checkbox" id="ing-check-${i}">
        <span>${ing}</span>
      </label>
    </li>
  `).join("");

  // Build Steps list html
  const stepsHtml = recipe.steps.map((step, i) => `
    <li>
      <div class="step-number">${i + 1}</div>
      <div class="step-text">${step}</div>
    </li>
  `).join("");

  content.innerHTML = `
    <!-- Column 1: Image & Basic Metadata Card -->
    <div class="recipe-details-info">
      <div class="recipe-details-header">
        <span class="recipe-details-category">${recipe.category}</span>
        <h1>${recipe.title}</h1>
        <div class="recipe-details-author-card">
          <i class="fa-regular fa-circle-user"></i>
          <span>Shared by <strong>${recipe.authorName}</strong></span>
          <span>•</span>
          <span>${new Date(recipe.createdDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
        </div>
      </div>

      <div class="recipe-details-stats">
        <div class="details-stat-item">
          <i class="fa-regular fa-clock"></i>
          <span class="details-stat-val">${totalTime}m</span>
          <span class="details-stat-lbl">Total Time</span>
        </div>
        <div class="details-stat-item">
          <i class="fa-solid fa-fire-burner"></i>
          <span class="details-stat-val">${recipe.prepTime}m / ${recipe.cookTime}m</span>
          <span class="details-stat-lbl">Prep / Cook</span>
        </div>
        <div class="details-stat-item">
          <i class="fa-solid fa-users"></i>
          <span class="details-stat-val">${recipe.servings}</span>
          <span class="details-stat-lbl">Servings</span>
        </div>
      </div>

      <p class="recipe-details-description">${recipe.description}</p>
    </div>

    <!-- Column 2: Details & Directions Checklist -->
    <div class="recipe-details-visual">
      <img src="${finalImg}" alt="${recipe.title}" onerror="this.src='${defaultImg}'">
    </div>

    <div class="recipe-sections-grid" style="grid-column: 1 / -1;">
      <div class="form-grid-2">
        <div class="details-section-card">
          <h3><i class="fa-solid fa-leaf"></i> Ingredients Checklist</h3>
          <ul class="ingredients-list-detail">
            ${ingredientsHtml}
          </ul>
        </div>

        <div class="details-section-card">
          <h3><i class="fa-solid fa-kitchen-set"></i> Preparation Directions</h3>
          <ul class="steps-list-detail">
            ${stepsHtml}
          </ul>
        </div>
      </div>
    </div>
  `;

  switchView("view-recipe-details");
}

// ============================================================================
// RECIPE EDITOR FORM CONTROLLER (CREATE & UPDATE)
// ============================================================================

// Dynamic input fields helper
function createInputRow(containerId, placeholderText, value = "") {
  const container = document.getElementById(containerId);
  const row = document.createElement("div");
  row.className = "dynamic-input-row";
  
  row.innerHTML = `
    <input type="text" required placeholder="${placeholderText}" value="${value}">
    <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()" title="Remove row">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  container.appendChild(row);
}

// Populate editor inputs for modifications
function openRecipeEditor(id = "", event = null) {
  if (event) event.stopPropagation(); // Avoid triggering card view modal

  // Require client authorization
  if (!currentUser || currentUser.role !== "client") {
    showToast("You must log in as a Client to manage recipes.", "danger");
    switchView("view-auth");
    return;
  }

  const titleEl = document.getElementById("form-view-title");
  const subtitleEl = document.getElementById("form-view-subtitle");
  const recipeIdInput = document.getElementById("editor-recipe-id");

  const titleInput = document.getElementById("recipe-title");
  const catSelect = document.getElementById("recipe-category");
  const descInput = document.getElementById("recipe-description");
  const prepInput = document.getElementById("recipe-prep-time");
  const cookInput = document.getElementById("recipe-cook-time");
  const servingsInput = document.getElementById("recipe-servings");
  const imgInput = document.getElementById("recipe-image-url");

  const ingContainer = document.getElementById("ingredients-inputs-container");
  const stepsContainer = document.getElementById("steps-inputs-container");

  ingContainer.innerHTML = "";
  stepsContainer.innerHTML = "";

  if (id === "") {
    // NEW RECIPE CREATION Mode
    titleEl.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Share a New Recipe`;
    subtitleEl.textContent = "Fill in details below to share your culinary creations with our users.";
    recipeIdInput.value = "";

    // Reset simple values
    document.getElementById("form-recipe-editor").reset();

    // Default dynamic rows
    createInputRow("ingredients-inputs-container", "e.g., 2 large eggs");
    createInputRow("ingredients-inputs-container", "e.g., 1 cup flour");
    createInputRow("steps-inputs-container", "e.g., Mix dry ingredients in a large bowl");
  } else {
    // MODIFY / EDIT RECIPE Mode
    const recipe = getRecipesFromDB().find(r => r.id === id);
    if (!recipe) {
      showToast("Cannot load editing recipe.", "danger");
      return;
    }

    // Verify ownership
    if (recipe.authorId !== currentUser.id) {
      showToast("You can only modify recipes created by yourself.", "danger");
      return;
    }

    titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Modify Recipe Details`;
    subtitleEl.textContent = `Editing: ${recipe.title}`;
    recipeIdInput.value = recipe.id;

    // Fill basic fields
    titleInput.value = recipe.title;
    catSelect.value = recipe.category;
    descInput.value = recipe.description;
    prepInput.value = recipe.prepTime;
    cookInput.value = recipe.cookTime;
    servingsInput.value = recipe.servings;
    imgInput.value = recipe.imageUrl || "";

    // Fill ingredients
    recipe.ingredients.forEach(ing => {
      createInputRow("ingredients-inputs-container", "e.g., 2 large eggs", ing);
    });

    // Fill steps
    recipe.steps.forEach(step => {
      createInputRow("steps-inputs-container", "e.g., Mix dry ingredients in a large bowl", step);
    });
  }

  switchView("view-recipe-form");
}

// Handle recipe editor submit
function handleRecipeSave(e) {
  e.preventDefault();

  if (!currentUser || currentUser.role !== "client") {
    showToast("Session expired. Please log in again.", "danger");
    switchView("view-auth");
    return;
  }

  const recipeId = document.getElementById("editor-recipe-id").value;
  const title = document.getElementById("recipe-title").value.trim();
  const category = document.getElementById("recipe-category").value;
  const description = document.getElementById("recipe-description").value.trim();
  const prepTime = parseInt(document.getElementById("recipe-prep-time").value);
  const cookTime = parseInt(document.getElementById("recipe-cook-time").value);
  const servings = parseInt(document.getElementById("recipe-servings").value);
  const imageUrl = document.getElementById("recipe-image-url").value.trim();

  // Grab dynamic inputs
  const ingInputs = document.querySelectorAll("#ingredients-inputs-container .dynamic-input-row input");
  const stepInputs = document.querySelectorAll("#steps-inputs-container .dynamic-input-row input");

  const ingredients = Array.from(ingInputs).map(inp => inp.value.trim()).filter(v => v !== "");
  const steps = Array.from(stepInputs).map(inp => inp.value.trim()).filter(v => v !== "");

  if (ingredients.length === 0) {
    showToast("Please add at least one ingredient.", "warning");
    return;
  }
  if (steps.length === 0) {
    showToast("Please add at least one preparation step.", "warning");
    return;
  }

  let recipes = getRecipesFromDB();

  if (recipeId === "") {
    // CREATE new recipe entry
    const newRecipe = {
      id: "recipe-" + Date.now(),
      title,
      description,
      category,
      prepTime,
      cookTime,
      servings,
      imageUrl,
      ingredients,
      steps,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdDate: Date.now()
    };

    recipes.push(newRecipe);
    saveRecipesToDB(recipes);
    showToast(`Recipe "${title}" has been published!`, "success");
  } else {
    // MODIFY existing recipe entry
    const idx = recipes.findIndex(r => r.id === recipeId);
    if (idx === -1) {
      showToast("Selected recipe could not be located in database.", "danger");
      return;
    }

    // Verify ownership security
    if (recipes[idx].authorId !== currentUser.id) {
      showToast("Access Denied: Recipe owner mismatch.", "danger");
      return;
    }

    // Update keys
    recipes[idx].title = title;
    recipes[idx].description = description;
    recipes[idx].category = category;
    recipes[idx].prepTime = prepTime;
    recipes[idx].cookTime = cookTime;
    recipes[idx].servings = servings;
    recipes[idx].imageUrl = imageUrl;
    recipes[idx].ingredients = ingredients;
    recipes[idx].steps = steps;

    saveRecipesToDB(recipes);
    showToast(`Recipe "${title}" updated successfully.`, "success");
  }

  // Go to discover / my recipes tab
  switchView("view-browse");
  renderRecipes();
}

// DELETE RECIPE
function deleteRecipe(id, event = null) {
  if (event) event.stopPropagation(); // Avoid opening recipe details

  if (!currentUser) {
    showToast("Please log in to perform this operation.", "danger");
    return;
  }

  const recipes = getRecipesFromDB();
  const target = recipes.find(r => r.id === id);

  if (!target) {
    showToast("Target recipe not found in database.", "danger");
    return;
  }

  // Security authorization verification
  const isOwner = target.authorId === currentUser.id;
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    showToast("Access Denied: You do not have permissions to delete this recipe.", "danger");
    return;
  }

  // Confirmation warning prompt
  const confirmDelete = confirm(`Are you sure you want to remove the recipe "${target.title}" permanently?`);
  if (!confirmDelete) return;

  const filteredRecipes = recipes.filter(r => r.id !== id);
  saveRecipesToDB(filteredRecipes);
  showToast(`Recipe "${target.title}" was deleted.`, "success");

  // Re-sync UI views depending on active screen
  const currentActiveView = document.querySelector(".app-view.active").id;
  if (currentActiveView === "view-admin") {
    renderAdminDashboard();
  } else if (currentActiveView === "view-recipe-details") {
    switchView("view-browse");
  } else {
    // If browsing
    const activeNavLink = document.querySelector(".nav-links a.active");
    if (activeNavLink && activeNavLink.id === "link-my-recipes") {
      filterMyRecipes();
    } else {
      renderRecipes();
    }
  }
}

// ============================================================================
// ADMIN DASHBOARD CONTROLLER
// ============================================================================

function renderAdminDashboard() {
  if (!currentUser || currentUser.role !== "admin") {
    showToast("Access Denied: Requires Administrator permissions.", "danger");
    switchView("view-browse");
    return;
  }

  const recipes = getRecipesFromDB();
  const users = getUsersFromDB().filter(u => u.role === "client"); // Count clients
  
  // Set Stat Values
  document.getElementById("admin-stat-recipes").textContent = recipes.length;
  document.getElementById("admin-stat-users").textContent = users.length;
  
  // Extract distinct categories
  const categories = new Set(recipes.map(r => r.category));
  document.getElementById("admin-stat-categories").textContent = Math.max(5, categories.size);

  const tableBody = document.getElementById("admin-recipe-table-body");
  const emptyState = document.getElementById("admin-empty-state");
  const tableContainer = document.querySelector(".table-container");

  tableBody.innerHTML = "";

  if (recipes.length === 0) {
    tableContainer.style.display = "none";
    emptyState.classList.remove("hidden");
    return;
  } else {
    tableContainer.style.display = "block";
    emptyState.classList.add("hidden");
  }

  recipes.forEach(recipe => {
    const tr = document.createElement("tr");
    const formattedDate = new Date(recipe.createdDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    tr.innerHTML = `
      <td>
        <span class="recipe-title-cell" onclick="showRecipeDetails('${recipe.id}')">
          ${recipe.title}
        </span>
      </td>
      <td><strong>${recipe.authorName}</strong></td>
      <td><span class="badge client-badge" style="font-size:0.7rem;">${recipe.category}</span></td>
      <td>${recipe.prepTime + recipe.cookTime} mins</td>
      <td>${formattedDate}</td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="deleteRecipe('${recipe.id}')">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
      </td>
    `;
    
    tableBody.appendChild(tr);
  });
}

// ============================================================================
// AUTHENTICATION LOGIC (LOGIN / REGISTRATION)
// ============================================================================

function setupAuthForms() {
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    formLogin.classList.add("active");
    formRegister.classList.remove("active");
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    formRegister.classList.add("active");
    formLogin.classList.remove("active");
  });

  // Login handler
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const pass = document.getElementById("login-password").value;

    const users = getUsersFromDB();
    const matchedUser = users.find(u => u.email === email && u.password === pass);

    if (matchedUser) {
      saveSession(matchedUser);
      showToast(`Welcome back, ${matchedUser.name}!`, "success");
      
      // Auto routing based on role
      if (matchedUser.role === "admin") {
        switchView("view-admin");
      } else {
        switchView("view-browse");
      }
      formLogin.reset();
    } else {
      showToast("Invalid email address or password.", "danger");
    }
  });

  // Register handler
  formRegister.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const pass = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;

    if (pass.length < 6) {
      showToast("Password must contain at least 6 characters.", "warning");
      return;
    }

    const users = getUsersFromDB();
    if (users.some(u => u.email === email)) {
      showToast("An account with this email already exists.", "danger");
      return;
    }

    const newUser = {
      id: "user-" + Date.now(),
      name,
      email,
      password: pass,
      role
    };

    users.push(newUser);
    saveUsersToDB(users);

    showToast("Registration successful! Logging you in...", "success");
    saveSession(newUser);

    if (newUser.role === "admin") {
      switchView("view-admin");
    } else {
      switchView("view-browse");
    }
    formRegister.reset();
  });}

// ============================================================================
// GLOBAL INITIALIZATION & EVEN LISTENERS
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Init DB and local session
  initDatabase();
  loadSession();

  // Route depending on session
  if (currentUser) {
    if (currentUser.role === "admin") {
      switchView("view-admin");
    } else {
      switchView("view-browse");
    }
  } else {
    switchView("view-auth");
  }

  // Navigation Links Setup
  document.getElementById("nav-logo").addEventListener("click", () => {
    if (!currentUser) {
      switchView("view-auth");
      showToast("Please log in to continue.", "warning");
    } else {
      switchView("view-browse");
    }
  });

  document.getElementById("link-browse").addEventListener("click", (e) => {
    e.preventDefault();
    if (!currentUser) {
      switchView("view-auth");
      showToast("Please log in to continue.", "warning");
      return;
    }
    activeCategory = "all";
    const catTabs = document.querySelectorAll(".category-tab");
    catTabs.forEach(t => t.classList.remove("active"));
    document.querySelector('[data-category="all"]').classList.add("active");
    switchView("view-browse");
  });

  document.getElementById("link-my-recipes").addEventListener("click", (e) => {
    e.preventDefault();
    switchView("view-browse");
    filterMyRecipes();
  });

  document.getElementById("link-add-recipe").addEventListener("click", (e) => {
    e.preventDefault();
    openRecipeEditor();
  });

  document.getElementById("link-admin").addEventListener("click", (e) => {
    e.preventDefault();
    switchView("view-admin");
  });

  document.getElementById("btn-login-trigger").addEventListener("click", () => {
    switchView("view-auth");
  });

  document.getElementById("btn-logout").addEventListener("click", destroySession);

  // Form cancellations
  document.getElementById("btn-cancel-recipe").addEventListener("click", () => {
    switchView("view-browse");
  });

  document.getElementById("btn-details-back").addEventListener("click", () => {
    const myRecipesLink = document.getElementById("link-my-recipes");
    if (myRecipesLink && myRecipesLink.classList.contains("active")) {
      switchView("view-browse");
      filterMyRecipes();
    } else {
      switchView(previousView);
    }
  });

  // Hero Actions
  document.getElementById("hero-btn-explore").addEventListener("click", () => {
    const filtersY = document.querySelector(".filters-section").getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: filtersY - 100, behavior: 'smooth' });
  });

  document.getElementById("hero-btn-add").addEventListener("click", () => {
    if (!currentUser) {
      showToast("Please log in first to share a recipe.", "info");
      switchView("view-auth");
    } else if (currentUser.role === "admin") {
      showToast("Administrators cannot author recipes. Please register as a Client.", "warning");
    } else {
      openRecipeEditor();
    }
  });

  // Category Filters click setup
  document.getElementById("category-filters").addEventListener("click", (e) => {
    if (e.target.classList.contains("category-tab")) {
      const tabs = document.querySelectorAll(".category-tab");
      tabs.forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      
      activeCategory = e.target.getAttribute("data-category");
      renderRecipes();
    }
  });

  // Search input typing handler
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    searchFilterQuery = e.target.value;
    renderRecipes();
  });

  // Reset search button empty state
  document.getElementById("btn-reset-search").addEventListener("click", () => {
    searchInput.value = "";
    searchFilterQuery = "";
    activeCategory = "all";
    const tabs = document.querySelectorAll(".category-tab");
    tabs.forEach(t => t.classList.remove("active"));
    document.querySelector('[data-category="all"]').classList.add("active");
    renderRecipes();
  });

  // Sorting selection changes
  document.getElementById("sort-select").addEventListener("change", renderRecipes);

  // Recipe Creator Form: dynamic lists listeners
  document.getElementById("btn-add-ingredient").addEventListener("click", () => {
    createInputRow("ingredients-inputs-container", "e.g., 1 tsp baking soda");
  });

  document.getElementById("btn-add-step").addEventListener("click", () => {
    createInputRow("steps-inputs-container", "e.g., Bake at 350°F for 20 minutes");
  });

  document.getElementById("form-recipe-editor").addEventListener("submit", handleRecipeSave);

  // Set up authentication tabs
  setupAuthForms();

  // Load and render initial list of recipes
  renderRecipes();
});
