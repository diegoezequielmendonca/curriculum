const toggleContent = (node) => {
	node.classList.toggle('active')
	node.nextElementSibling.classList.toggle('hidden')
}

document.querySelectorAll('.toggle-content').forEach(node => {
	node.addEventListener('click', () => {
		toggleContent(node)
	})
})