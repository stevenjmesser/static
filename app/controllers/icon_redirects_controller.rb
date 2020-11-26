class IconRedirectsController < ApplicationController
  def show
    redirect_to view_context.asset_path(request.path.to_s[1..-1]), status: :moved_permanently
  end

  def apple_old_size_icon
    redirect_to view_context.asset_path('apple-touch-icon.png'), status: :moved_permanently
  end

  def brexit
    endo_transition = Date.new(2021, 1, 1)
    today_in_london = Time.find_zone("Europe/London").today
    days_left_integer = (endo_transition - today_in_london).to_i
    days_left = sprintf "%02d", days_left_integer

    svg =  <<-SVG
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">

    <g>
     <title>background</title>
     <rect x="-1" y="-1" width="802" height="602" id="canvas_background" fill="#fff"/>
     <g id="canvasGrid" display="none">
      <rect id="svg_5" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)"/>
     </g>
    </g>
    <g>
     <title>Layer 1</title>
     <rect fill="#1e1348" stroke="#1e1348" stroke-width="1.5" x="100" y="150" width="60" height="38" id="svg_1"/>
     <rect fill="#1e1348" stroke="#1e1348" stroke-width="1.5" x="100" y="192" width="60" height="38" id="svg_2"/>
     <rect fill="#1e1348" stroke="#1e1348" stroke-width="1.5" x="164" y="150" width="60" height="38" id="svg_3"/>
     <rect fill="#1e1348" stroke="#1e1348" stroke-width="1.5" x="164" y="192" width="60" height="38" id="svg_4"/>
     <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_6" y="120" x="101" stroke-width="0" stroke="#1e1348" fill="#1e1348">Brexit Transition</text>
     <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_7" y="198" x="235" stroke-width="0" stroke="#1e1348" fill="#1e1348">days to go</text>
     <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="80" id="svg_9" y="218.45313" x="110" stroke-width="0" stroke="#1e1348" fill="#fff">#{days_left[0]}</text>
     <text font-weight="bold" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="80" id="svg_10" y="218.45313" x="172" stroke-width="0" stroke="#1e1348" fill="#fff">#{days_left[1]}</text>
     <a id="svg_8">
      <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="19" id="svg_12" y="268.45313" x="100" stroke-width="0" stroke="#1e1348" fill="#1e1348">Check you're ready for 2021</text>
     </a>
    </g>
   </svg>
   SVG

    respond_to do |format|
      format.svg { render inline: svg}
    end
  end
end
