// Saves options to chrome.storage
function save_options() {
    let group = document.getElementById('group').value;
    if(chrome) {
        chrome.storage.local.set({
            group: group
        }, () => {
            // Update status to let user know options were saved.
            let status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        });
    } else {
        console.log('No chrome object!');
    }

}

// Restores defaults
function restore_options() {
    if(chrome) {
        chrome.storage.local.get({
            group: 1
        }, function(items) {
            document.getElementById('group').value = items.group;
        });
    } else {
        console.log('No chrome object!');
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);