/**
 * Tab 选项卡组件（可复用）
 *
 * 用法：页面中存在 .闫启智_tab-group 结构即可自动初始化，支持多组互不干扰。
 *   <div class="闫启智_tab-group">
 *     <div class="闫启智_tab-list">
 *       <button class="闫启智_tab-btn 闫启智_active" data-闫启智-tab-control="闫启智_panel_1">标题</button>
 *     </div>
 *     <section class="闫启智_tab-panel 闫启智_active" id="闫启智_panel_1">内容</section>
 *   </div>
 */
(function () {
  'use strict';

  var 闫启智_GROUP_SELECTOR = '.闫启智_tab-group';
  var 闫启智_BUTTON_SELECTOR = '.闫启智_tab-btn';
  var 闫启智_PANEL_SELECTOR = '.闫启智_tab-panel';
  var 闫启智_ACTIVE_CLASS = '闫启智_active';

  /**
   * 清除该选项卡组内所有按钮与面板的选中状态
   */
  function 闫启智_clearTabState(闫启智_group) {
    var 闫启智_buttons = 闫启智_group.querySelectorAll(闫启智_BUTTON_SELECTOR);
    var 闫启智_panels = 闫启智_group.querySelectorAll(闫启智_PANEL_SELECTOR);

    Array.prototype.forEach.call(闫启智_buttons, function (闫启智_button) {
      闫启智_button.classList.remove(闫启智_ACTIVE_CLASS);
      闫启智_button.setAttribute('aria-selected', 'false');
      闫启智_button.setAttribute('tabindex', '-1');
    });

    Array.prototype.forEach.call(闫启智_panels, function (闫启智_panel) {
      闫启智_panel.classList.remove(闫启智_ACTIVE_CLASS);
      闫启智_panel.setAttribute('hidden', 'hidden');
    });
  }

  /**
   * 设置当前按钮及其对应面板为选中状态
   */
  function 闫启智_activateTab(闫启智_group, 闫启智_button) {
    闫启智_clearTabState(闫启智_group);

    var 闫启智_panelId = 闫启智_button.getAttribute('data-闫启智-tab-control');
    var 闫启智_panel = 闫启智_group.querySelector('#' + 闫启智_panelId) || document.getElementById(闫启智_panelId);

    闫启智_button.classList.add(闫启智_ACTIVE_CLASS);
    闫启智_button.setAttribute('aria-selected', 'true');
    闫启智_button.setAttribute('tabindex', '0');

    if (闫启智_panel) {
      闫启智_panel.classList.add(闫启智_ACTIVE_CLASS);
      闫启智_panel.removeAttribute('hidden');
    }
  }

  /**
   * 键盘左右方向键切换选项卡
   */
  function 闫启智_handleKeydown(闫启智_group, 闫启智_event) {
    if (闫启智_event.key !== 'ArrowLeft' && 闫启智_event.key !== 'ArrowRight') {
      return;
    }

    var 闫启智_button = 闫启智_event.target.closest(闫启智_BUTTON_SELECTOR);
    if (!闫启智_button) {
      return;
    }

    var 闫启智_buttons = Array.prototype.slice.call(闫启智_group.querySelectorAll(闫启智_BUTTON_SELECTOR));
    var 闫启智_index = 闫启智_buttons.indexOf(闫启智_button);
    if (闫启智_index === -1) {
      return;
    }

    var 闫启智_nextIndex = 闫启智_event.key === 'ArrowRight'
      ? (闫启智_index + 1) % 闫启智_buttons.length
      : (闫启智_index - 1 + 闫启智_buttons.length) % 闫启智_buttons.length;

    闫启智_event.preventDefault();
    闫启智_activateTab(闫启智_group, 闫启智_buttons[闫启智_nextIndex]);
    闫启智_buttons[闫启智_nextIndex].focus();
  }

  /**
   * 初始化页面内所有选项卡组
   */
  function 闫启智_initTabs() {
    var 闫启智_groups = document.querySelectorAll(闫启智_GROUP_SELECTOR);

    Array.prototype.forEach.call(闫启智_groups, function (闫启智_group) {
      // 事件监听依赖事件冒泡：点击事件由按钮冒泡到组容器统一处理
      闫启智_group.addEventListener('click', function (闫启智_event) {
        var 闫启智_button = 闫启智_event.target.closest(闫启智_BUTTON_SELECTOR);
        if (!闫启智_button || !闫启智_group.contains(闫启智_button)) {
          return;
        }
        闫启智_activateTab(闫启智_group, 闫启智_button);
      });

      闫启智_group.addEventListener('keydown', function (闫启智_event) {
        闫启智_handleKeydown(闫启智_group, 闫启智_event);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', 闫启智_initTabs);
  } else {
    闫启智_initTabs();
  }
})();
