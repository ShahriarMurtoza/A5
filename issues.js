// API Configuration

const API_URL =
"https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];



// Create Issue Card

function createIssueCard(issue){

    const card = document.createElement("div");


    const statusColor =
    issue.status === "open"
    ? "badge-success"
    : "badge-error";


    const borderTopColor =
    issue.status === "open"
    ? "border-t-4 border-green-500"
    : "border-t-4 border-red-500";


    card.className =
    `card bg-base-100 border border-gray-200 rounded-xl shadow hover:shadow-xl transition ${borderTopColor}`;


    const priorityClass =
    issue.priority === "high"
    ? "text-red-500 bg-red-200 px-2 py-1 rounded-lg"
    : issue.priority === "medium"
    ? "text-yellow-600 bg-yellow-200 px-2 py-1 rounded-lg"
    : "text-green-600 bg-green-200 px-2 py-1 rounded-lg";


    const priorityText = issue.priority || "N/A";


    card.innerHTML =

    `
    <div class="card-body">

      <div class="flex justify-between items-start mb-3">

        <h2 class="card-title text-lg line-clamp-2">
          ${issue.title || "Untitled"}
        </h2>

        <span class="badge ${statusColor}">
          ${issue.status || "unknown"}
        </span>

      </div>


      <span class="badge badge-outline mb-3">
        ${issue.labels?.join(", ") || "No Labels"}
      </span>


      <p class="text-sm text-gray-600 line-clamp-3 mb-4">
        ${issue.description || "No description provided"}
      </p>


    <div class="divider my-2"></div>


      <div class="flex flex-col gap-2 text-sm">

        <div class="flex justify-between">

          <span class="text-gray-500">
            Priority:
          </span>

          <span class="font-semibold capitalize ${priorityClass}">
            ${priorityText}
          </span>

        </div>


        <div class="flex justify-between">

          <span class="text-gray-500">
            Assigned to:
          </span>

          <span class="font-semibold">
            ${issue.assignedTo || "Unassigned"}
          </span>

        </div>


        <div class="flex justify-between">

          <span class="text-gray-500">
            Created:
          </span>

          <span class="font-semibold">
            ${formatDate(issue.createdAt)}
          </span>

        </div>

      </div>


      <div class="card-actions justify-end mt-4">

        <button
        onclick='showIssueDetails(${JSON.stringify(issue)})'
        class="btn btn-sm btn-primary">

        View Details

      </button>

    </div>

  </div>
  `;

  return card;

}



// Format Date

function formatDate(dateString){

    if(!dateString) return "N/A";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US",{
      year:"numeric",
      month:"short",
      day:"numeric"
  });

}



// Render Issues

function renderIssues(issues){

    const container =
    document.getElementById("issues-container");

    container.innerHTML = "";

    issues.forEach(issue => {

      const card = createIssueCard(issue);

      container.appendChild(card);

  });

}



// Load Issues

async function loadIssues(){

  const container =
  document.getElementById("issues-container");

  const loading =
  document.getElementById("loading");

  const errorDiv =
  document.getElementById("error");

  const errorMsg =
  document.getElementById("error-msg");


  try{

    const response = await fetch(API_URL);

    if(!response.ok){
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    loading.classList.add("hidden");

    const issues =
    Array.isArray(data)
    ? data
    : data.issues || data.data || [];

    allIssues = issues;

    renderIssues(allIssues);

  }

  catch(error){

      loading.classList.add("hidden");

      errorDiv.classList.remove("hidden");

      errorMsg.textContent =
      `Failed to load issues: ${error.message}`;

    }

  }



  // Filter Tabs

  function showAllIssues(){
      renderIssues(allIssues);
    }

    function showOpenIssues(){

        const openIssues =
        allIssues.filter(issue => issue.status === "open");

        renderIssues(openIssues);

      }

      function showClosedIssues(){

          const closedIssues =
          allIssues.filter(issue => issue.status === "closed");

          renderIssues(closedIssues);

        }



        // Search

        function searchIssues(){

            const searchValue =
            document.getElementById("search-input")
            .value
            .toLowerCase();


            const filteredIssues =
            allIssues.filter(issue =>

            (issue.title && issue.title.toLowerCase().includes(searchValue)) ||

            (issue.description && issue.description.toLowerCase().includes(searchValue)) ||

            (issue.assignedTo &&
            issue.assignedTo.toLowerCase().includes(searchValue))

          );

          renderIssues(filteredIssues);

        }



        // Modal

        function showIssueDetails(issue){

            document.getElementById("modal-title").textContent =
            issue.title || "Untitled";

            document.getElementById("modal-description").textContent =
            issue.description || "No description";

            document.getElementById("modal-status").textContent =
            issue.status || "Unknown";

            document.getElementById("modal-labels").textContent =
            issue.labels?.join(", ") || "No labels";

            document.getElementById("modal-priority").textContent =
            issue.priority || "N/A";

            document.getElementById("modal-assigned").textContent =
            issue.assignedTo || "Unassigned";

            document.getElementById("modal-created").textContent =
            formatDate(issue.createdAt);

            document.getElementById("issueModal").showModal();

          }



          function closeModal(){

              document.getElementById("issueModal").close();

            }



            // Event Listeners

            document
            .getElementById("search-input")
            .addEventListener("keydown", function(event){

              if(event.key === "Enter"){
                event.preventDefault();
                searchIssues();
              }

          });


          document
          .getElementById("all-tab")
          .addEventListener("click", showAllIssues);

          document
          .getElementById("open-tab")
          .addEventListener("click", showOpenIssues);

          document
          .getElementById("closed-tab")
          .addEventListener("click", showClosedIssues);



          document.addEventListener(
            "DOMContentLoaded",
            loadIssues
          );