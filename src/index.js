'use strict'

const componentNameAttr = 'data-guide-role';
const htmlTagsArray = ['doctype','html','head','title','base','link','meta','style','script','noscript','body','article','nav','aside','section','header','footer','h1','h2','h3','h4','h5','h6','main','address','p','hr','pre','blockquote','ol','ul','li','dl','dt','dd','figure','figcaption','div','table','caption','thead','tbody','tfoot','tr','th','td','col','colgroup','form','fieldset','legend','label','input','button','select','datalist','optgroup','option','textarea','keygen','output','progress','meter','details','summary','command','menu','del','ins','img','iframe','embed','object','param','video','audio','source','canvas','track','map','area','a','em','strong','i','b','u','s','small','abbr','q','cite','dfn','sub','sup','time','code','kbd','samp','var','mark','bdi','bdo','ruby','rt','rp','span','br','wbr'];

module.exports = ({ types: t }) => {

	function generateName (componentName, role) {
		if (role != null) {
			return componentName + '-' + role;
		}

		return componentName;
	}

	function makeAttribute (componentName, attributeName='component-id') {
		return t.jSXAttribute(
			t.jSXIdentifier(`data-${attributeName}`),
			t.stringLiteral(`${componentName}`)
		)
	}

	return {
		visitor: {
			JSXOpeningElement (path, state) {
				const { attributes, loc, name } = path.container.openingElement

				if (!loc) { return }

				let implicitRole, componentNameAttrIndex = null;

				attributes.forEach(function(attribute, i) {
					if (attribute.hasOwnProperty('name') && attribute.name.hasOwnProperty('name') && attribute.name.name == componentNameAttr) {
						if (attribute.hasOwnProperty('value') && attribute.value.hasOwnProperty('value')) {
							implicitRole = attribute.value.value;
							componentNameAttrIndex = i;
							return;
						}
					}
				}, this);

				if (!name.hasOwnProperty('name')) {return}

				// Skip for HTML tags if no role attribute specified
				if (componentNameAttrIndex == null) {
					if (htmlTagsArray.indexOf(name.name) !== -1) { return };
				}

				attributes.push(
					makeAttribute(
						generateName(name.name, implicitRole),
						state.opts.attributeName
					)
				)
			},
			JSXAttribute(path) {
				if (path.node.name.name === componentNameAttr) {
				path.remove();
				}
			}
		}
	}
}